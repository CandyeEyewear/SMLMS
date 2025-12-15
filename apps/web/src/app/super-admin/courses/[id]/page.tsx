// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type CourseType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category: { id: string; name: string } | null;
};

type EnrollmentStatType = {
  status: string;
};

export default async function CourseDetailPage({
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

  // Fetch the course with category
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      description,
      thumbnail_url,
      duration_minutes,
      is_active,
      is_featured,
      created_at,
      updated_at,
      category:course_categories(id, name)
    `)
    .eq('id', id)
    .single();

  if (error || !course) {
    notFound();
  }

  const typedCourse = course as CourseType;

  // Fetch enrollment stats
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select('status')
    .eq('course_id', id);

  const enrollments = (enrollmentsData || []) as EnrollmentStatType[];

  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'in_progress').length;
  const notStartedEnrollments = enrollments.filter((e) => e.status === 'not_started').length;

  const completionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

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
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/super-admin/courses"
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{typedCourse.title}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  typedCourse.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {typedCourse.is_active ? 'Active' : 'Inactive'}
              </span>
              {typedCourse.is_featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">/{typedCourse.slug}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/super-admin/courses/${id}/modules`}
              className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
            >
              Manage Modules
            </Link>
            <Link
              href={`/super-admin/courses/${id}/edit`}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Edit Course
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {typedCourse.thumbnail_url ? (
                <Image
                  src={typedCourse.thumbnail_url}
                  alt={typedCourse.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            {typedCourse.description ? (
              <p className="text-gray-600 whitespace-pre-wrap">{typedCourse.description}</p>
            ) : (
              <p className="text-gray-400">No description provided.</p>
            )}
          </div>

          {/* Enrollment Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-500">{totalEnrollments}</p>
                <p className="text-sm text-gray-500">Total Enrolled</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedEnrollments}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-accent-500">{inProgressEnrollments}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-500">{notStartedEnrollments}</p>
                <p className="text-sm text-gray-500">Not Started</p>
              </div>
            </div>

            {totalEnrollments > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium text-gray-900">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {typedCourse.category?.name || 'Uncategorized'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Duration</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatDuration(typedCourse.duration_minutes)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(typedCourse.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Updated</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(typedCourse.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/super-admin/courses/${id}/modules`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Manage Modules</span>
              </Link>
              <Link
                href={`/super-admin/courses/${id}/edit`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Edit Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
