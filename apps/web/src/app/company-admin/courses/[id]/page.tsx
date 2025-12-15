// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AssignCourseForm } from './assign-course-form';

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
  id: string;
  user_id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
  user: { id: string; email: string; full_name: string | null };
};

type GroupType = {
  id: string;
  name: string;
};

type TeamMemberType = {
  id: string;
  email: string;
  full_name: string | null;
};

export default async function CourseAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;

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

  // Verify course is available to this company
  const { data: companyCourse } = await supabase
    .from('company_courses')
    .select('id')
    .eq('company_id', profile.company_id)
    .eq('course_id', courseId)
    .single();

  if (!companyCourse) {
    notFound();
  }

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      slug,
      thumbnail_url,
      duration_minutes,
      is_active,
      category:course_categories(id, name)
    `)
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const typedCourse = course as CourseType;

  // Fetch enrollments for this course in this company
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      id,
      user_id,
      status,
      progress_percent,
      enrolled_at,
      completed_at,
      user:profiles(id, email, full_name)
    `)
    .eq('course_id', courseId)
    .eq('company_id', profile.company_id)
    .order('enrolled_at', { ascending: false });

  const enrollments = (enrollmentsData || []) as unknown as EnrollmentType[];

  // Fetch groups for assignment dropdown
  const { data: groupsData } = await supabase
    .from('groups')
    .select('id, name')
    .eq('company_id', profile.company_id)
    .order('name');

  const groups = (groupsData || []) as GroupType[];

  // Fetch team members not yet enrolled
  const enrolledUserIds = enrollments.map((e) => e.user_id);
  const { data: teamMembersData } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('company_id', profile.company_id)
    .order('full_name');

  const allTeamMembers = (teamMembersData || []) as TeamMemberType[];
  const availableMembers = allTeamMembers.filter((m) => !enrolledUserIds.includes(m.id));

  // Stats
  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const inProgress = enrollments.filter((e) => e.status === 'in_progress').length;
  const notStarted = enrollments.filter((e) => e.status === 'not_started').length;
  const completionRate = totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0;

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
          href="/company-admin/courses"
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{typedCourse.title}</h1>
            {typedCourse.category && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded mt-2">
                {typedCourse.category.name}
              </span>
            )}
          </div>
          <AssignCourseForm
            courseId={courseId}
            companyId={profile.company_id}
            groups={groups}
            availableMembers={availableMembers}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold text-primary-500">{totalEnrolled}</p>
              <p className="text-sm text-gray-500">Enrolled</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold text-accent-500">{inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{notStarted}</p>
              <p className="text-sm text-gray-500">Not Started</p>
            </div>
          </div>

          {/* Completion Rate */}
          {totalEnrolled > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion Rate</span>
                <span className="font-medium text-gray-900">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}

          {/* Enrollments List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Enrolled Learners</h2>
            </div>

            {enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Learner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {enrollment.user.full_name?.[0] || enrollment.user.email[0].toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {enrollment.user.full_name || 'No name'}
                              </p>
                              <p className="text-xs text-gray-500">{enrollment.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enrollment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : enrollment.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {enrollment.status === 'completed'
                              ? 'Completed'
                              : enrollment.status === 'in_progress'
                              ? 'In Progress'
                              : 'Not Started'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-accent-500 h-2 rounded-full"
                                style={{ width: `${enrollment.progress_percent || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">{enrollment.progress_percent || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No learners enrolled yet. Use the &quot;Assign Course&quot; button to get started.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
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
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Course Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Duration</dt>
                  <dd className="font-medium text-gray-900">{formatDuration(typedCourse.duration_minutes)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Available members</dt>
                  <dd className="font-medium text-gray-900">{availableMembers.length}</dd>
                </div>
              </dl>

              {typedCourse.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{typedCourse.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
