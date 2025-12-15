// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CourseForm } from '../../course-form';

type CategoryType = {
  id: string;
  name: string;
};

type CourseType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
};

export default async function EditCoursePage({
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

  // Fetch the course
  const { data: course, error } = await supabase
    .from('courses')
    .select('id, title, slug, description, thumbnail_url, duration_minutes, category_id, is_active, is_featured')
    .eq('id', id)
    .single();

  if (error || !course) {
    notFound();
  }

  // Fetch categories for the dropdown
  const { data: categoriesData } = await supabase
    .from('categories' as never)
    .select('id, name')
    .order('name');

  const categories = (categoriesData || []) as CategoryType[];

  return <CourseForm categories={categories} course={course as CourseType} />;
}
