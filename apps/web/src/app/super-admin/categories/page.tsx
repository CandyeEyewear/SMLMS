// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CategoryRowActions } from './category-row-actions';

// Type definitions
type CategoryType = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
  description: string | null;
};

type CourseCountType = {
  category_id: string | null;
};

export default async function CategoriesPage() {
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

  // Fetch categories with course counts
  const { data: categoriesData } = await supabase
    .from('course_categories' as never)
    .select(`
      id,
      name,
      description,
      slug,
      icon,
      created_at
    ` as never)
    .order('name', { ascending: true });

  const categories = (categoriesData || []) as CategoryType[];

  // Fetch course counts per category
  const { data: courseCountsData } = await supabase
    .from('courses')
    .select('category_id');

  const courseCounts = (courseCountsData || []) as CourseCountType[];

  // Create a map of category course counts
  const categoryCourseCounts = new Map<string, number>();
  courseCounts.forEach((course) => {
    if (course.category_id) {
      const count = categoryCourseCounts.get(course.category_id) || 0;
      categoryCourseCounts.set(course.category_id, count + 1);
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize courses into categories for easy navigation.
          </p>
        </div>
        <Link
          href="/super-admin/categories/new"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          Add Category
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Categories
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Courses Categorized
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">
            {courseCounts.filter((c) => !!c.category_id).length}
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
        </div>

        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => {
                  const courseCount = categoryCourseCounts.get(category.id) || 0;
                  return (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {category.icon || category.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            {category.description ? (
                              <div className="text-sm text-gray-500 line-clamp-1">{category.description}</div>
                            ) : (
                              <div className="text-sm text-gray-400">No description</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {courseCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <CategoryRowActions categoryId={category.id} categoryName={category.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No categories yet. Create your first category to organize your courses.
          </div>
        )}
      </div>
    </div>
  );
}
