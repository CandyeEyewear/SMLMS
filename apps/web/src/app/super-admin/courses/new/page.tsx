// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CourseForm } from '../course-form';

type CategoryType = {
  id: string;
  name: string;
};

export default async function NewCoursePage() {
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Choose how you want to create your course.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <Link
          href="/super-admin/courses/new/builder"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Drag & Drop Builder</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Visual course builder with drag-and-drop content blocks. Add videos, images, text, quizzes, and more with an intuitive interface.
          </p>
          <span className="text-primary-500 font-medium">Get Started →</span>
        </Link>

        <Link
          href="/super-admin/courses/ai-builder"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AI Course Builder</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Generate a complete course outline using AI. Perfect for quickly creating structured courses with modules, lessons, and quizzes.
          </p>
          <span className="text-primary-500 font-medium">Get Started →</span>
        </Link>

        <Link
          href="/super-admin/courses/new/manual"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Manual Creation</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Build your course from scratch with full control over every detail. Create modules, lessons, and content manually.
          </p>
          <span className="text-primary-500 font-medium">Get Started →</span>
        </Link>
      </div>
    </div>
  );
}
