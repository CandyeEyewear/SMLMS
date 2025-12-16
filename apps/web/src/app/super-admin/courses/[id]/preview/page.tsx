import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CoursePreview } from './course-preview';

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

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', id)
    .single();

  if (!course) {
    notFound();
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

