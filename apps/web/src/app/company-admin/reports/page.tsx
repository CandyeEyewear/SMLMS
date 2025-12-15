// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExportReportsButton } from './export-button';

type ProfileType = {
  id: string;
  role: string;
  company_id: string | null;
};

type EnrollmentType = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
  course: { id: string; title: string };
  user: { id: string; email: string; full_name: string | null };
};

type TeamMemberType = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export default async function CompanyReportsPage() {
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

  // Fetch all enrollments for the company
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      id,
      user_id,
      course_id,
      status,
      progress_percent,
      enrolled_at,
      completed_at,
      course:courses(id, title),
      user:profiles(id, email, full_name)
    `)
    .eq('company_id', profile.company_id)
    .order('enrolled_at', { ascending: false });

  const enrollments = (enrollmentsData || []) as unknown as EnrollmentType[];

  // Fetch team members
  const { data: teamMembersData } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .eq('company_id', profile.company_id)
    .order('full_name');

  const teamMembers = (teamMembersData || []) as TeamMemberType[];

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'in_progress').length;
  const notStartedEnrollments = enrollments.filter((e) => e.status === 'not_started').length;
  const overallCompletionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

  // Calculate average progress
  const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0);
  const averageProgress = totalEnrollments > 0 ? Math.round(totalProgress / totalEnrollments) : 0;

  // Course stats
  const courseStats = new Map<string, { title: string; total: number; completed: number }>();
  enrollments.forEach((e) => {
    if (!e.course) return;
    const current = courseStats.get(e.course.id) || { title: e.course.title, total: 0, completed: 0 };
    current.total++;
    if (e.status === 'completed') current.completed++;
    courseStats.set(e.course.id, current);
  });

  // User stats
  const userStats = new Map<string, { name: string; email: string; total: number; completed: number }>();
  enrollments.forEach((e) => {
    if (!e.user) return;
    const current = userStats.get(e.user_id) || {
      name: e.user.full_name || 'No name',
      email: e.user.email,
      total: 0,
      completed: 0,
    };
    current.total++;
    if (e.status === 'completed') current.completed++;
    userStats.set(e.user_id, current);
  });

  // Recent completions
  const recentCompletions = enrollments
    .filter((e) => e.status === 'completed' && e.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 10);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ lineHeight: '1.2' }}>Reports</h1>
            <p className="text-gray-600 mt-1">
              Track your team&apos;s learning progress and performance.
            </p>
          </div>
          <ExportReportsButton companyId={profile.company_id} />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Team Members
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{teamMembers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Enrollments
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalEnrollments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Completion Rate
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{overallCompletionRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Avg. Progress
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">{averageProgress}%</p>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedEnrollments}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inProgressEnrollments}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{notStartedEnrollments}</p>
          <p className="text-sm text-gray-500">Not Started</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
          </div>
          {courseStats.size > 0 ? (
            <div className="divide-y divide-gray-200">
              {Array.from(courseStats.values()).map((course, index) => {
                const rate = course.total > 0 ? Math.round((course.completed / course.total) * 100) : 0;
                return (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-900 truncate">{course.title}</p>
                      <span className="text-sm text-gray-500">
                        {course.completed}/{course.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              No course enrollments yet.
            </div>
          )}
        </div>

        {/* Learner Progress */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Member Performance</h2>
            <p className="text-xs text-gray-500 mt-1">Click on a team member to view detailed performance</p>
          </div>
          {userStats.size > 0 ? (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {Array.from(userStats.entries()).map(([userId, userStat]) => {
                const rate = userStat.total > 0 ? Math.round((userStat.completed / userStat.total) * 100) : 0;
                return (
                  <Link
                    key={userId}
                    href={`/company-admin/reports/${userId}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {userStat.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{userStat.name}</p>
                          <p className="text-xs text-gray-500">{userStat.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {userStat.completed}/{userStat.total}
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              No learner enrollments yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Completions */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Completions</h2>
        </div>
        {recentCompletions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Learner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCompletions.map((enrollment) => (
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.completed_at
                        ? new Date(enrollment.completed_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No completions yet.
          </div>
        )}
      </div>
    </div>
  );
}
