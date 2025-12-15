// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CourseForm } from '../../course-form';

type CategoryType = {
  id: string;
  name: string;
};

export default async function ManualCoursePage() {
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

  // Fetch categories for the dropdown
  const { data: categoriesData } = await supabase
    .from('categories' as never)
    .select('id, name')
    .order('name');

  const categories = (categoriesData || []) as CategoryType[];

  return <CourseForm categories={categories} />;
}

