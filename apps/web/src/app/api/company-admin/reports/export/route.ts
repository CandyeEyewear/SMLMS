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

    // Fetch enrollments with limit
    const MAX_ENROLLMENTS = 500;
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
      .order('enrolled_at', { ascending: false })
      .limit(MAX_ENROLLMENTS);

    // Transform the data to handle Supabase's response format
    const enrollments = ((enrollmentsData || []) as Array<{
      id: any;
      course_id: any;
      status: any;
      progress_percent: any;
      enrolled_at: any;
      completed_at: any;
      course: { id: any; title: any } | { id: any; title: any }[] | null;
    }>).map((enrollment) => ({
      id: String(enrollment.id),
      course_id: String(enrollment.course_id),
      status: String(enrollment.status),
      progress_percent: Number(enrollment.progress_percent) || 0,
      enrolled_at: String(enrollment.enrolled_at),
      completed_at: enrollment.completed_at ? String(enrollment.completed_at) : null,
      course: Array.isArray(enrollment.course) 
        ? { id: String(enrollment.course[0]?.id || ''), title: String(enrollment.course[0]?.title || '') }
        : (enrollment.course ? { id: String(enrollment.course.id || ''), title: String(enrollment.course.title || '') } : { id: '', title: '' }),
    })) as Array<{
      id: string;
      course_id: string;
      status: string;
      progress_percent: number;
      enrolled_at: string;
      completed_at: string | null;
      course: { id: string; title: string };
    }>;

    // Fetch progress with limit
    const MAX_PROGRESS = 500;
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
      .eq('user_id', userId)
      .limit(MAX_PROGRESS);

    // Transform the progress data to handle Supabase's response format
    const progress = ((progressData || []) as Array<{
      course_id: any;
      completed_lessons_count: any;
      total_lessons_count: any;
      time_spent_seconds: any;
      last_accessed_at: any;
      course: { id: any; title: any } | { id: any; title: any }[] | null;
    }>).map((p) => ({
      course_id: String(p.course_id),
      completed_lessons_count: Number(p.completed_lessons_count) || 0,
      total_lessons_count: Number(p.total_lessons_count) || 0,
      time_spent_seconds: Number(p.time_spent_seconds) || 0,
      last_accessed_at: p.last_accessed_at ? String(p.last_accessed_at) : null,
      course: Array.isArray(p.course)
        ? { id: String(p.course[0]?.id || ''), title: String(p.course[0]?.title || '') }
        : (p.course ? { id: String(p.course.id || ''), title: String(p.course.title || '') } : { id: '', title: '' }),
    })) as Array<{
      course_id: string;
      completed_lessons_count: number;
      total_lessons_count: number;
      time_spent_seconds: number;
      last_accessed_at: string | null;
      course: { id: string; title: string };
    }>;

    // Fetch quiz attempts with limit
    const MAX_QUIZ_ATTEMPTS = 500;
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
      .order('started_at', { ascending: false })
      .limit(MAX_QUIZ_ATTEMPTS);

    // Transform the quiz attempts data to handle Supabase's response format
    const quizAttempts = ((quizAttemptsData || []) as Array<{
      quiz_id: any;
      attempt_number: any;
      score: any;
      max_score: any;
      percentage: any;
      passed: any;
      time_spent_seconds: any;
      started_at: any;
      submitted_at: any;
      quiz: { 
        id: any; 
        title: any; 
        course_id: any;
        course: { id: any; title: any } | { id: any; title: any }[] | null;
      } | { 
        id: any; 
        title: any; 
        course_id: any;
        course: { id: any; title: any } | { id: any; title: any }[] | null;
      }[] | null;
    }>).map((attempt) => {
      const quiz = Array.isArray(attempt.quiz) ? attempt.quiz[0] : attempt.quiz;
      const course = quiz && !Array.isArray(quiz.course) ? quiz.course : (Array.isArray(quiz?.course) ? quiz.course[0] : null);
      
      return {
        quiz_id: String(attempt.quiz_id),
        attempt_number: Number(attempt.attempt_number) || 0,
        score: Number(attempt.score) || 0,
        max_score: Number(attempt.max_score) || 0,
        percentage: Number(attempt.percentage) || 0,
        passed: Boolean(attempt.passed),
        time_spent_seconds: Number(attempt.time_spent_seconds) || 0,
        started_at: String(attempt.started_at),
        submitted_at: attempt.submitted_at ? String(attempt.submitted_at) : null,
        quiz: {
          id: quiz ? String(quiz.id || '') : '',
          title: quiz ? String(quiz.title || '') : '',
          course_id: quiz ? String(quiz.course_id || '') : '',
          course: course ? { id: String(course.id || ''), title: String(course.title || '') } : null,
        },
      };
    }) as Array<{
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

