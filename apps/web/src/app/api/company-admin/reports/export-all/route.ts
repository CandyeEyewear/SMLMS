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

    const enrollments = (enrollmentsData || []) as Array<{
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

    const progress = (progressData || []) as Array<{
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

