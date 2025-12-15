// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type CourseProgressType = {
  id: string;
  course_id: string;
  progress_percentage: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  course: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    duration_minutes: number | null;
  };
};

type LessonProgressType = {
  lesson_id: string;
  status: string;
  completed_at: string | null;
  lesson: {
    id: string;
    title: string;
    module: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
};

type QuizAttemptType = {
  id: string;
  quiz_id: string;
  attempt_number: number;
  score: number | null;
  passed: boolean | null;
  completed_at: string;
  quiz: {
    id: string;
    title: string;
    module: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
};

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company_id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Fetch course progress
  const { data: courseProgressData } = await supabase
    .from('user_course_progress')
    .select(`
      id,
      course_id,
      progress_percentage,
      status,
      started_at,
      completed_at,
      last_accessed_at,
      course:courses(
        id,
        title,
        thumbnail_url,
        duration_minutes
      )
    `)
    .eq('user_id', user.id)
    .order('last_accessed_at', { ascending: false });

  const courseProgress = (courseProgressData || []) as CourseProgressType[];

  // Fetch recent lesson completions
  const { data: lessonProgressData } = await supabase
    .from('user_lesson_progress')
    .select(`
      lesson_id,
      status,
      completed_at,
      lesson:lessons(
        id,
        title,
        module:modules(
          id,
          title,
          course:courses(
            id,
            title
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(10);

  const recentLessons = (lessonProgressData || []) as LessonProgressType[];

  // Fetch quiz attempts
  const { data: quizAttemptsData } = await supabase
    .from('quiz_attempts')
    .select(`
      id,
      quiz_id,
      attempt_number,
      score,
      passed,
      completed_at,
      quiz:quizzes(
        id,
        title,
        module:modules(
          id,
          title,
          course:courses(
            id,
            title
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(10);

  const quizAttempts = (quizAttemptsData || []) as QuizAttemptType[];

  // Calculate overall stats
  const totalCourses = courseProgress.length;
  const completedCourses = courseProgress.filter((cp) => cp.status === 'completed').length;
  const inProgressCourses = courseProgress.filter((cp) => cp.status === 'in_progress').length;
  const averageProgress = totalCourses > 0
    ? Math.round(
        courseProgress.reduce((sum, cp) => sum + (cp.progress_percentage || 0), 0) / totalCourses
      )
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning journey and achievements.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Courses
          </h3>
          <p className="text-3xl font-bold text-primary-500">{totalCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-accent-500">{inProgressCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Avg. Progress
          </h3>
          <p className="text-3xl font-bold text-primary-500">{averageProgress}%</p>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Course Progress</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {courseProgress.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No course progress yet. Start a course to see your progress here.
            </div>
          ) : (
            courseProgress.map((cp) => (
              <Link
                key={cp.id}
                href={`/learner/courses/${cp.course.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {cp.course.thumbnail_url ? (
                    <Image
                      src={cp.course.thumbnail_url}
                      alt={cp.course.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{cp.course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cp.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : cp.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {cp.status === 'completed' ? 'Completed' : cp.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                      </span>
                      {cp.last_accessed_at && (
                        <span>
                          Last accessed: {new Date(cp.last_accessed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          cp.status === 'completed' ? 'bg-green-500' : 'bg-accent-500'
                        }`}
                        style={{ width: `${cp.progress_percentage || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{cp.progress_percentage || 0}% complete</span>
                      {cp.completed_at && (
                        <span>Completed: {new Date(cp.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Lesson Completions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Lesson Completions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLessons.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No lessons completed yet.
              </div>
            ) : (
              recentLessons.map((lp) => (
                <div key={lp.lesson_id} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <Link
                      href={`/learner/courses/${lp.lesson.module.course.id}/learn/${lp.lesson.id}`}
                      className="font-medium text-gray-900 hover:text-primary-500"
                    >
                      {lp.lesson.title}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600">
                    {lp.lesson.module.course.title} • {lp.lesson.module.title}
                  </p>
                  {lp.completed_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {new Date(lp.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Quiz Attempts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {quizAttempts.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No quiz attempts yet.
              </div>
            ) : (
              quizAttempts.map((qa) => (
                <div key={qa.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <Link
                      href={`/learner/courses/${qa.quiz.module.course.id}/quiz/${qa.quiz.id}`}
                      className="font-medium text-gray-900 hover:text-primary-500"
                    >
                      {qa.quiz.title}
                    </Link>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      qa.passed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {qa.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {qa.quiz.module.course.title} • {qa.quiz.module.title}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Attempt {qa.attempt_number} • Score: {qa.score || 0}%
                    </span>
                    <span className="text-gray-500">
                      {new Date(qa.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

