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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the user belongs to the same company
    const { data: teamMember } = await supabase
      .from('profiles')
      .select('id, email, full_name, company_id')
      .eq('id', userId)
      .eq('company_id', profile.company_id)
      .single();

    if (!teamMember) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch enrollments
    const { data: enrollmentsData } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        status,
        progress_percent,
        enrolled_at,
        completed_at,
        course:courses(id, title)
      `)
      .eq('user_id', userId)
      .eq('company_id', profile.company_id)
      .order('enrolled_at', { ascending: false });

    const enrollments = (enrollmentsData || []) as Array<{
      id: string;
      course_id: string;
      status: string;
      progress_percent: number;
      enrolled_at: string;
      completed_at: string | null;
      course: { id: string; title: string };
    }>;

    // Fetch progress
    const { data: progressData } = await supabase
      .from('user_course_progress')
      .select(`
        course_id,
        completed_lessons_count,
        total_lessons_count,
        time_spent_seconds,
        last_accessed_at,
        course:courses(id, title)
      `)
      .eq('user_id', userId);

    const progress = (progressData || []) as Array<{
      course_id: string;
      completed_lessons_count: number;
      total_lessons_count: number;
      time_spent_seconds: number;
      last_accessed_at: string | null;
      course: { id: string; title: string };
    }>;

    // Fetch quiz attempts
    const { data: quizAttemptsData } = await supabase
      .from('user_quiz_attempts')
      .select(`
        quiz_id,
        attempt_number,
        score,
        max_score,
        percentage,
        passed,
        time_spent_seconds,
        started_at,
        submitted_at,
        quiz:quizzes(id, title, course_id, course:courses(id, title))
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    const quizAttempts = (quizAttemptsData || []) as Array<{
      quiz_id: string;
      attempt_number: number;
      score: number;
      max_score: number;
      percentage: number;
      passed: boolean;
      time_spent_seconds: number;
      started_at: string;
      submitted_at: string | null;
      quiz: { 
        id: string; 
        title: string; 
        course_id: string;
        course: { id: string; title: string } | null;
      };
    }>;

    // Generate CSV
    const csvRows: string[] = [];

    // Header
    csvRows.push('Performance Report');
    csvRows.push(`Team Member: ${teamMember.full_name || teamMember.email}`);
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push('');

    // Course Progress Section
    csvRows.push('Course Progress');
    csvRows.push('Course,Status,Progress %,Lessons Completed,Total Lessons,Time Spent (hours),Enrolled Date,Completed Date');
    
    enrollments.forEach((enrollment) => {
      const courseProgress = progress.find((p) => p.course_id === enrollment.course_id);
      const hours = Math.floor((courseProgress?.time_spent_seconds || 0) / 3600);
      const minutes = Math.floor(((courseProgress?.time_spent_seconds || 0) % 3600) / 60);
      const timeSpent = `${hours}.${Math.round((minutes / 60) * 100)}`;

      csvRows.push([
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

    csvRows.push('');

    // Quiz Performance Section
    if (quizAttempts.length > 0) {
      csvRows.push('Quiz Performance');
      csvRows.push('Quiz,Course,Attempt,Score,Max Score,Percentage,Passed,Time Spent (hours),Date');
      
      quizAttempts.forEach((attempt) => {
        const hours = Math.floor((attempt.time_spent_seconds || 0) / 3600);
        const minutes = Math.floor(((attempt.time_spent_seconds || 0) % 3600) / 60);
        const timeSpent = `${hours}.${Math.round((minutes / 60) * 100)}`;

        csvRows.push([
          `"${attempt.quiz?.title || 'Unknown Quiz'}"`,
          `"${attempt.quiz?.course?.title || 'Unknown Course'}"`,
          attempt.attempt_number,
          attempt.score,
          attempt.max_score,
          attempt.percentage,
          attempt.passed ? 'Yes' : 'No',
          timeSpent,
          attempt.submitted_at
            ? new Date(attempt.submitted_at).toLocaleDateString()
            : new Date(attempt.started_at).toLocaleDateString(),
        ].join(','));
      });
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${(teamMember.full_name || teamMember.email).replace(/[^a-z0-9]/gi, '_')}_performance_report_${new Date().toISOString().split('T')[0]}.csv"`,
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

