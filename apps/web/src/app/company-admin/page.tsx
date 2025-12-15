import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CompanyAdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_id, role')
    .eq('id', user.id)
    .single<{ full_name: string | null; company_id: string | null; role: string }>();

  if (!profile?.company_id || !['company_admin', 'super_admin'].includes(profile.role || '')) {
    redirect('/login');
  }

  const companyId = profile.company_id as string;

  // Get core counts + activity + company info in parallel
  const [
    { count: teamCount },
    { count: groupCount },
    { count: activeEnrollmentCount },
    { data: companyUsers },
    { data: recentActivityRaw },
    { data: company },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('role', 'user'),
    supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId),
    supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .in('status', ['not_started', 'in_progress']),
    supabase
      .from('profiles')
      .select('id')
      .eq('company_id', companyId)
      .eq('role', 'user'),
    (supabase as unknown as { from: (table: string) => ReturnType<typeof supabase.from> })
      .from('activity_log' as never)
      .select('id, action, entity_type, created_at, user_id, metadata, entity_id')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single(),
  ]);

  const userIds = (companyUsers || []).map((u) => (u as { id: string }).id);

  // Completion rate (from user_course_progress)
  let completionRate = 0;
  let overdueCount = 0;

  if (userIds.length > 0) {
    const [{ data: progressRows }, { count: overdue }] = await Promise.all([
      (supabase as unknown as { from: (table: string) => ReturnType<typeof supabase.from> })
        .from('user_course_progress' as never)
        .select('completed_lessons_count, total_lessons_count, user_id')
        .in('user_id', userIds),
      (supabase as unknown as { from: (table: string) => ReturnType<typeof supabase.from> })
        .from('user_course_progress' as never)
        .select('id', { count: 'exact', head: true })
        .in('user_id', userIds)
        .eq('is_overdue', true),
    ]);

    const totals = ((progressRows || []) as Array<{
      completed_lessons_count?: number;
      total_lessons_count?: number;
    }>).reduce(
      (acc: { completed: number; total: number }, row) => {
        acc.completed += row.completed_lessons_count || 0;
        acc.total += row.total_lessons_count || 0;
        return acc;
      },
      { completed: 0, total: 0 }
    );

    completionRate = totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;
    overdueCount = overdue || 0;
  }

  const recentActivity = (recentActivityRaw || []) as Array<{
    id: string;
    action: string;
    entity_type: string | null;
    created_at: string;
    user_id: string | null;
    metadata: unknown;
    entity_id: string | null;
  }>;

  const companyName = (company as { name: string } | null)?.name || 'Company';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ lineHeight: '1.2' }}>
        {companyName} Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Team Members</p>
          <p className="text-3xl font-bold text-gray-900">{teamCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Groups</p>
          <p className="text-3xl font-bold text-gray-900">{groupCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Active Courses</p>
          <p className="text-3xl font-bold text-gray-900">{activeEnrollmentCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/company-admin/team/new"
              className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Add Team Member</p>
              <p className="text-sm text-gray-500">Invite a new user to your team</p>
            </Link>
            <Link
              href="/company-admin/groups"
              className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Create Group</p>
              <p className="text-sm text-gray-500">Organize users into teams</p>
            </Link>
            <Link
              href="/company-admin/courses"
              className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Assign Course</p>
              <p className="text-sm text-gray-500">Assign training to your team</p>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Needs Attention</h3>
          {overdueCount > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">Overdue assignments</p>
              <p className="mt-1 text-3xl font-bold text-amber-900">{overdueCount}</p>
              <p className="mt-1 text-sm text-amber-700">
                Learners with overdue items need attention.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No issues to address</p>
              <p className="text-sm">Overdue assignments will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.action}
                    {item.entity_type ? (
                      <span className="text-gray-500 font-normal"> · {item.entity_type}</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {item.user_id ? 'User action' : 'System'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm">User progress and completions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
