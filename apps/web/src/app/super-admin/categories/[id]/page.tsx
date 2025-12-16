import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CategoryEditForm } from '../category-edit-form';

export default async function EditCategoryPage({
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

  const { data: category, error } = await supabase
    .from('categories' as never)
    .select('id, name, slug, description, icon' as never)
    .eq('id' as never, id as never)
    .single() as unknown as {
      data: { id: string; name: string; slug: string; description: string | null; icon: string | null } | null;
      error: Error | null;
    };

  if (error || !category) {
    notFound();
  }

  const c = category;

  return <CategoryEditForm category={c} />;
}
