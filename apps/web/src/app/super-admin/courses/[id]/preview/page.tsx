import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CoursePreview } from './course-preview';

// Component for when course is not found - more helpful than generic 404
function CourseNotFound({ courseId }: { courseId: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h1>
        <p className="text-gray-600 mb-4">
          The course you&apos;re trying to preview doesn&apos;t exist or may not have been saved correctly.
        </p>

        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 mb-1">Requested Course ID:</p>
          <code className="text-sm text-gray-700 break-all">{courseId}</code>
        </div>

        <div className="space-y-3 text-left mb-6">
          <p className="text-sm font-medium text-gray-700">This could happen if:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>The course creation failed (check browser console for errors)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>The course was deleted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>There was a database connection issue during save</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/super-admin/courses"
            className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Go to Course Library
          </Link>
          <Link
            href="/super-admin/courses/ai-builder"
            className="w-full px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Create New Course with AI
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/login');
  }

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', id)
    .single();

  if (!course || courseError) {
    return <CourseNotFound courseId={id} />;
  }

  const { data: modulesData } = await supabase
    .from('modules')
    .select('id, title, description, sort_order')
    .eq('course_id', id)
    .order('sort_order', { ascending: true });

  const moduleIds = (modulesData || []).map((m) => (m as { id: string }).id);
  let lessonsData: any[] = [];
  if (moduleIds.length) {
    const { data } = await supabase
      .from('lessons')
      .select('id, module_id, title, description, sort_order, duration_minutes, content')
      .in('module_id', moduleIds)
      .order('sort_order', { ascending: true });
    lessonsData = (data || []) as any[];
  }

  const lessonsByModule = new Map<string, any[]>();
  (lessonsData || []).forEach((l) => {
    const moduleId = (l as { module_id: string }).module_id;
    const list = lessonsByModule.get(moduleId) || [];
    list.push(l);
    lessonsByModule.set(moduleId, list);
  });

  const modules = (modulesData || []).map((m) => ({
    ...(m as any),
    lessons: lessonsByModule.get((m as { id: string }).id) || [],
  }));

  return <CoursePreview courseId={course.id} courseTitle={course.title} modules={modules as any} />;
}

