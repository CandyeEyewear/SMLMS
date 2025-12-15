import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is a company admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single<{ role: string; company_id: string | null }>();

    if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId || companyId !== profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all team members
    const { data: teamMembersData } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('company_id', companyId)
      .eq('role', 'user')
      .order('full_name');

    const teamMembers = (teamMembersData || []) as Array<{
      id: string;
      email: string;
      full_name: string | null;
    }>;

    // Fetch all enrollments for the company
    const { data: enrollmentsData } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        course_id,
        status,
        progress_percent,
        enrolled_at,
        completed_at,
        course:courses(id, title),
        user:profiles(id, email, full_name)
      `)
      .eq('company_id', companyId)
      .order('enrolled_at', { ascending: false });

    // Transform the data to handle Supabase's response format
    const enrollments = ((enrollmentsData || []) as Array<{
      id: any;
      user_id: any;
      course_id: any;
      status: any;
      progress_percent: any;
      enrolled_at: any;
      completed_at: any;
      course: { id: any; title: any } | { id: any; title: any }[] | null;
      user: { id: any; email: any; full_name: any } | { id: any; email: any; full_name: any }[] | null;
    }>).map((enrollment) => ({
      id: String(enrollment.id),
      user_id: String(enrollment.user_id),
      course_id: String(enrollment.course_id),
      status: String(enrollment.status),
      progress_percent: Number(enrollment.progress_percent) || 0,
      enrolled_at: String(enrollment.enrolled_at),
      completed_at: enrollment.completed_at ? String(enrollment.completed_at) : null,
      course: Array.isArray(enrollment.course) 
        ? { id: String(enrollment.course[0]?.id || ''), title: String(enrollment.course[0]?.title || '') }
        : (enrollment.course ? { id: String(enrollment.course.id || ''), title: String(enrollment.course.title || '') } : { id: '', title: '' }),
      user: Array.isArray(enrollment.user)
        ? { id: String(enrollment.user[0]?.id || ''), email: String(enrollment.user[0]?.email || ''), full_name: enrollment.user[0]?.full_name ? String(enrollment.user[0].full_name) : null }
        : (enrollment.user ? { id: String(enrollment.user.id || ''), email: String(enrollment.user.email || ''), full_name: enrollment.user.full_name ? String(enrollment.user.full_name) : null } : { id: '', email: '', full_name: null }),
    })) as Array<{
      id: string;
      user_id: string;
      course_id: string;
      status: string;
      progress_percent: number;
      enrolled_at: string;
      completed_at: string | null;
      course: { id: string; title: string };
      user: { id: string; email: string; full_name: string | null };
    }>;

    // Fetch progress for all users
    const userIds = teamMembers.map((tm) => tm.id);
    const { data: progressData } = userIds.length > 0
      ? await supabase
          .from('user_course_progress')
          .select(`
            user_id,
            course_id,
            completed_lessons_count,
            total_lessons_count,
            time_spent_seconds,
            course:courses(id, title)
          `)
          .in('user_id', userIds)
      : { data: [] };

    // Transform the progress data to handle Supabase's response format
    const progress = ((progressData || []) as Array<{
      user_id: any;
      course_id: any;
      completed_lessons_count: any;
      total_lessons_count: any;
      time_spent_seconds: any;
      course: { id: any; title: any } | { id: any; title: any }[] | null;
    }>).map((p) => ({
      user_id: String(p.user_id),
      course_id: String(p.course_id),
      completed_lessons_count: Number(p.completed_lessons_count) || 0,
      total_lessons_count: Number(p.total_lessons_count) || 0,
      time_spent_seconds: Number(p.time_spent_seconds) || 0,
      course: Array.isArray(p.course)
        ? { id: String(p.course[0]?.id || ''), title: String(p.course[0]?.title || '') }
        : (p.course ? { id: String(p.course.id || ''), title: String(p.course.title || '') } : { id: '', title: '' }),
    })) as Array<{
      user_id: string;
      course_id: string;
      completed_lessons_count: number;
      total_lessons_count: number;
      time_spent_seconds: number;
      course: { id: string; title: string };
    }>;

    // Generate CSV
    const csvRows: string[] = [];

    // Header
    csvRows.push('Team Performance Report');
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push(`Total Team Members: ${teamMembers.length}`);
    csvRows.push('');

    // Summary Section
    csvRows.push('Summary');
    csvRows.push('Team Member,Total Courses,Completed Courses,In Progress,Not Started,Average Progress %');
    
    teamMembers.forEach((member) => {
      const memberEnrollments = enrollments.filter((e) => e.user_id === member.id);
      const total = memberEnrollments.length;
      const completed = memberEnrollments.filter((e) => e.status === 'completed').length;
      const inProgress = memberEnrollments.filter((e) => e.status === 'in_progress').length;
      const notStarted = memberEnrollments.filter((e) => e.status === 'not_started').length;
      const avgProgress = total > 0
        ? Math.round(
            memberEnrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / total
          )
        : 0;

      csvRows.push([
        `"${member.full_name || member.email}"`,
        total,
        completed,
        inProgress,
        notStarted,
        avgProgress,
      ].join(','));
    });

    csvRows.push('');
    csvRows.push('');

    // Detailed Course Progress
    csvRows.push('Detailed Course Progress');
    csvRows.push('Team Member,Email,Course,Status,Progress %,Lessons Completed,Total Lessons,Time Spent (hours),Enrolled Date,Completed Date');
    
    enrollments.forEach((enrollment) => {
      const courseProgress = progress.find(
        (p) => p.user_id === enrollment.user_id && p.course_id === enrollment.course_id
      );
      const hours = Math.floor((courseProgress?.time_spent_seconds || 0) / 3600);
      const minutes = Math.floor(((courseProgress?.time_spent_seconds || 0) % 3600) / 60);
      const timeSpent = `${hours}.${Math.round((minutes / 60) * 100)}`;

      csvRows.push([
        `"${enrollment.user?.full_name || 'Unknown'}"`,
        enrollment.user?.email || '',
        `"${enrollment.course?.title || 'Unknown'}"`,
        enrollment.status,
        enrollment.progress_percent || 0,
        courseProgress?.completed_lessons_count || 0,
        courseProgress?.total_lessons_count || 0,
        timeSpent,
        new Date(enrollment.enrolled_at).toLocaleDateString(),
        enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : '',
      ].join(','));
    });

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="team_performance_report_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}

