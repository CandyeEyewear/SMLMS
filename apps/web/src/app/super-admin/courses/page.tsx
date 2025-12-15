// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CourseActions } from './course-actions';

// Type definitions
type CourseType = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail_url: string | null;
  duration_minutes: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  category: { id: string; name: string } | null;
};

type CategoryType = {
  id: string;
  name: string;
};

type EnrollmentCountType = {
  course_id: string;
};

export default async function CoursesPage() {
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

  // Fetch courses with category info
  const { data: coursesData } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      slug,
      thumbnail_url,
      duration_minutes,
      is_active,
      is_featured,
      created_at,
      category:course_categories(id, name)
    `)
    .order('created_at', { ascending: false });

  const courses = (coursesData || []) as CourseType[];

  // Fetch categories for filtering
  const { data: categoriesData } = await supabase
    .from('course_categories' as never)
    .select('id, name')
    .order('name');

  const categories = (categoriesData || []) as CategoryType[];

  // Fetch enrollment counts per course
  const { data: enrollmentCountsData } = await supabase
    .from('enrollments')
    .select('course_id');

  const enrollmentCounts = (enrollmentCountsData || []) as EnrollmentCountType[];

  // Create a map of course enrollment counts
  const courseEnrollmentCounts = new Map<string, number>();
  enrollmentCounts.forEach((enrollment) => {
    const count = courseEnrollmentCounts.get(enrollment.course_id) || 0;
    courseEnrollmentCounts.set(enrollment.course_id, count + 1);
  });

  // Fetch company assignment counts per course
  const { data: companyAssignmentsData } = await supabase
    .from('company_courses')
    .select('course_id');

  const companyAssignments = (companyAssignmentsData || []) as EnrollmentCountType[];

  // Create a map of course-to-company assignment counts
  const courseCompanyCounts = new Map<string, number>();
  companyAssignments.forEach((assignment) => {
    const count = courseCompanyCounts.get(assignment.course_id) || 0;
    courseCompanyCounts.set(assignment.course_id, count + 1);
  });

  // Stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.is_active).length;
  const featuredCourses = courses.filter((c) => c.is_featured).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-600 mt-1">
            Manage all courses available on the platform.
          </p>
        </div>
        <Link
          href="/super-admin/courses/new"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          Create Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Active Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{activeCourses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Featured Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">{featuredCourses}</p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Companies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map((course) => {
                  const enrollments = courseEnrollmentCounts.get(course.id) || 0;
                  const assignedCompanies = courseCompanyCounts.get(course.id) || 0;

                  return (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                            {course.thumbnail_url ? (
                              <Image
                                src={course.thumbnail_url}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                              {course.is_featured && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {course.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.duration_minutes
                          ? `${Math.floor(course.duration_minutes / 60)}h ${course.duration_minutes % 60}m`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignedCompanies > 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {assignedCompanies} {assignedCompanies === 1 ? 'company' : 'companies'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <CourseActions
                          courseId={course.id}
                          courseName={course.title}
                          isActive={course.is_active}
                          hasEnrollments={enrollments > 0}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No courses yet. Create your first course above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
