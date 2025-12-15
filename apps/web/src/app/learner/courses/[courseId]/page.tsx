// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type ModuleType = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons: Array<{
    id: string;
    title: string;
    sort_order: number;
  }>;
  quiz: {
    id: string;
    title: string;
  } | null;
};

type ProgressType = {
  progress_percentage: number;
  status: string;
  last_accessed_at: string | null;
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
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

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, status, progress_percent')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single();

  if (!enrollment) {
    notFound();
  }

  // Fetch course with modules and lessons
  const { data: course } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      duration_minutes,
      modules:modules(
        id,
        title,
        description,
        sort_order,
        lessons:lessons(
          id,
          title,
          sort_order
        ),
        quiz:quizzes(
          id,
          title
        )
      )
    `)
    .eq('id', courseId)
    .single();

  if (!course) {
    notFound();
  }

  // Fetch progress
  const { data: progress } = await supabase
    .from('user_course_progress')
    .select('progress_percentage, status, last_accessed_at')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single<ProgressType>();

  const modules = (course.modules || []) as ModuleType[];
  const sortedModules = modules.sort((a, b) => a.sort_order - b.sort_order);

  // Find first incomplete lesson
  const firstIncompleteLesson = sortedModules
    .flatMap((module) =>
      module.lessons.map((lesson) => ({
        moduleId: module.id,
        lessonId: lesson.id,
        moduleTitle: module.title,
        lessonTitle: lesson.title,
      }))
    )
    .find((_, index) => {
      // For now, just return first lesson - we'll enhance this with progress tracking
      return index === 0;
    });

  return (
    <div className="p-8">
      <Link
        href="/learner/courses"
        className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
      >
        ← Back to Courses
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            width={1200}
            height={400}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 mb-4">{course.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            {course.duration_minutes && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.duration_minutes} minutes</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{sortedModules.length} modules</span>
            </div>
          </div>

          {progress && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Your Progress</span>
                <span>{progress.progress_percentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-accent-500 h-3 rounded-full transition-all"
                  style={{ width: `${progress.progress_percentage || 0}%` }}
                />
              </div>
            </div>
          )}

          {firstIncompleteLesson && (
            <Link
              href={`/learner/courses/${courseId}/learn/${firstIncompleteLesson.lessonId}`}
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              {progress?.progress_percentage === 0 ? 'Start Course' : 'Continue Learning'}
            </Link>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {sortedModules.map((module, moduleIndex) => (
          <div key={module.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Module {moduleIndex + 1}: {module.title}
                </h2>
                {module.description && (
                  <p className="text-gray-600 mt-1">{module.description}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {module.lessons
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.id}
                    href={`/learner/courses/${courseId}/learn/${lesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-sm">
                      {lessonIndex + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}

              {module.quiz && (
                <Link
                  href={`/learner/courses/${courseId}/quiz/${module.quiz.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-accent-200 bg-accent-50"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{module.quiz.title}</p>
                    <p className="text-sm text-gray-600">Quiz</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


