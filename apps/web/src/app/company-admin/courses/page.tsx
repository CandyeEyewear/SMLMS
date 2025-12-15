// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type ProfileType = {
  id: string;
  role: string;
  company_id: string | null;
};

type CourseType = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  category: { id: string; name: string } | null;
};

type EnrollmentType = {
  course_id: string;
  status: string;
};

export default async function CompanyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company_id')
    .eq('id', user.id)
    .single<ProfileType>();

  if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
    redirect('/login');
  }

  // Fetch company_courses (courses available to this company)
  const { data: companyCourseIds } = await supabase
    .from('company_courses')
    .select('course_id')
    .eq('company_id', profile.company_id);

  const courseIds = (companyCourseIds || []).map((cc) => (cc as { course_id: string }).course_id);

  // Fetch course details for available courses
  let courses: CourseType[] = [];
  if (courseIds.length > 0) {
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
        category:categories(id, name)
      `)
      .in('id', courseIds)
      .eq('is_active', true)
      .order('title');

    courses = (coursesData || []) as CourseType[];
  }

  // Fetch enrollment stats for this company
  const { data: enrollmentStatsData } = await supabase
    .from('enrollments')
    .select('course_id, status')
    .eq('company_id', profile.company_id);

  const enrollmentStats = (enrollmentStatsData || []) as EnrollmentType[];

  // Create enrollment counts map
  const courseEnrollments = new Map<string, { total: number; completed: number; inProgress: number }>();
  enrollmentStats.forEach((enrollment) => {
    const current = courseEnrollments.get(enrollment.course_id) || { total: 0, completed: 0, inProgress: 0 };
    current.total++;
    if (enrollment.status === 'completed') current.completed++;
    if (enrollment.status === 'in_progress') current.inProgress++;
    courseEnrollments.set(enrollment.course_id, current);
  });

  // Stats
  const totalEnrollments = enrollmentStats.length;
  const completedEnrollments = enrollmentStats.filter((e) => e.status === 'completed').length;
  const inProgressEnrollments = enrollmentStats.filter((e) => e.status === 'in_progress').length;

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-600 mt-1">
            Assign courses to your team members and groups.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Available Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Enrollments
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            In Progress
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">{inProgressEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Completed
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{completedEnrollments}</p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const stats = courseEnrollments.get(course.id) || { total: 0, completed: 0, inProgress: 0 };
            const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

            return (
              <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-200 relative">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                  </div>

                  {course.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded mb-2">
                      {course.category.name}
                    </span>
                  )}

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {course.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{formatDuration(course.duration_minutes)}</span>
                    <span>{stats.total} enrolled</span>
                  </div>

                  {/* Progress bar */}
                  {stats.total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Completion</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/company-admin/courses/${course.id}`}
                    className="block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    Manage Assignments
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No courses available</h3>
          <p className="text-gray-500">
            Contact your administrator to get courses added to your library.
          </p>
        </div>
      )}
    </div>
  );
}
