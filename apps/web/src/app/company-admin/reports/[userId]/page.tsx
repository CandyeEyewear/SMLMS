// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExportButton } from './export-button';

type ProfileType = {
  id: string;
  role: string;
  company_id: string | null;
};

type EnrollmentType = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
  course: { id: string; title: string };
};

type ProgressType = {
  id: string;
  user_id: string;
  course_id: string;
  completed_lessons_count: number;
  total_lessons_count: number;
  time_spent_seconds: number;
  last_accessed_at: string | null;
  course: { id: string; title: string };
};

type QuizAttemptType = {
  id: string;
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
};

export default async function TeamMemberDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company_id')
    .eq('id', user.id)
    .single<ProfileType>();

  if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
    redirect('/login');
  }

  // Fetch team member details
  const { data: teamMember } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, company_id')
    .eq('id', userId)
    .eq('company_id', profile.company_id)
    .single();

  if (!teamMember) {
    redirect('/company-admin/reports');
  }

  // Fetch enrollments for this user
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
      course:courses(id, title)
    `)
    .eq('user_id', userId)
    .eq('company_id', profile.company_id)
    .order('enrolled_at', { ascending: false });

  const enrollments = (enrollmentsData || []) as unknown as EnrollmentType[];

  // Fetch detailed progress
  const { data: progressData } = await supabase
    .from('user_course_progress')
    .select(`
      id,
      user_id,
      course_id,
      completed_lessons_count,
      total_lessons_count,
      time_spent_seconds,
      last_accessed_at,
      course:courses(id, title)
    `)
    .eq('user_id', userId);

  const progress = (progressData || []) as unknown as ProgressType[];

  // Fetch quiz attempts
  const { data: quizAttemptsData } = await supabase
    .from('user_quiz_attempts')
    .select(`
      id,
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

  const quizAttempts = (quizAttemptsData || []) as unknown as QuizAttemptType[];

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'in_progress').length;
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / enrollments.length)
    : 0;

  // Calculate total time spent
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0);
  const hoursSpent = Math.floor(totalTimeSpent / 3600);
  const minutesSpent = Math.floor((totalTimeSpent % 3600) / 60);

  // Calculate quiz stats
  const totalQuizAttempts = quizAttempts.length;
  const passedQuizzes = quizAttempts.filter((q) => q.passed).length;
  const averageQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizAttempts.length)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/company-admin/reports"
          className="text-sm text-primary-500 hover:text-primary-600 mb-4 inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ lineHeight: '1.2' }}>
              {teamMember.full_name || 'Team Member'} Performance
            </h1>
            <p className="text-gray-600 mt-1">{teamMember.email}</p>
          </div>
          <ExportButton userId={userId} userName={teamMember.full_name || teamMember.email} />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Completed
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{completedEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Avg. Progress
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">{averageProgress}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Time Spent
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">
            {hoursSpent}h {minutesSpent}m
          </p>
        </div>
      </div>

      {/* Course Progress Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
        </div>
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lessons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment) => {
                  const courseProgress = progress.find((p) => p.course_id === enrollment.course_id);
                  const lessonsCompleted = courseProgress?.completed_lessons_count || 0;
                  const totalLessons = courseProgress?.total_lessons_count || 0;
                  const courseTimeSpent = courseProgress?.time_spent_seconds || 0;
                  const hours = Math.floor(courseTimeSpent / 3600);
                  const minutes = Math.floor((courseTimeSpent % 3600) / 60);

                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{enrollment.course.title}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            enrollment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : enrollment.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {enrollment.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-accent-500 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress_percent || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{enrollment.progress_percent || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lessonsCompleted}/{totalLessons}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hours > 0 ? `${hours}h ` : ''}{minutes}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.completed_at
                          ? new Date(enrollment.completed_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No course enrollments yet.
          </div>
        )}
      </div>

      {/* Quiz Performance */}
      {quizAttempts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Quiz Performance</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total Attempts: {totalQuizAttempts}</span>
                <span>Passed: {passedQuizzes}</span>
                <span>Avg Score: {averageQuizScore}%</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizAttempts.map((attempt) => {
                  const hours = Math.floor((attempt.time_spent_seconds || 0) / 3600);
                  const minutes = Math.floor(((attempt.time_spent_seconds || 0) % 3600) / 60);

                  return (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{attempt.quiz?.title || 'Unknown Quiz'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.quiz?.course?.title || 'Unknown Course'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{attempt.attempt_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {attempt.score}/{attempt.max_score} ({attempt.percentage}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            attempt.passed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hours > 0 ? `${hours}h ` : ''}{minutes}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.submitted_at
                          ? new Date(attempt.submitted_at).toLocaleDateString()
                          : new Date(attempt.started_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

