// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TeamMemberActions } from './team-member-actions';
import Link from 'next/link';

// Type definitions
type ProfileType = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  company_id: string | null;
};

type TeamMemberType = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  is_active: boolean;
};

type GroupType = {
  id: string;
  name: string;
};

type EnrollmentStatType = {
  user_id: string;
  status: string;
};

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<ProfileType>();

  if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
    redirect('/login');
  }

  // Fetch team members
  const { data: teamMembersData } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, avatar_url, created_at, is_active')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false });

  const teamMembers = (teamMembersData || []) as TeamMemberType[];

  // Fetch groups for the company
  const { data: groupsData } = await supabase
    .from('groups')
    .select('id, name')
    .eq('company_id', profile.company_id)
    .order('name');

  const _groups = (groupsData || []) as GroupType[];

  // Fetch group memberships (to show per-user groups)
  const { data: groupMembershipsData } = await supabase
    .from('group_members')
    .select('user_id, group:groups(id, name)' as never)
    .in('user_id', teamMembers.map((m) => m.id) as never) as unknown as {
      data: Array<{ user_id: string; group: { id: string; name: string } | null }> | null
    };

  const groupMemberships = groupMembershipsData || [];

  const userGroups = new Map<string, string[]>();
  groupMemberships.forEach((m) => {
    const name = m.group?.name;
    if (!name) return;
    const current = userGroups.get(m.user_id) || [];
    current.push(name);
    userGroups.set(m.user_id, current);
  });

  // Fetch enrollment stats for each user
  const { data: enrollmentStatsData } = await supabase
    .from('enrollments')
    .select('user_id, status')
    .eq('company_id', profile.company_id);

  const enrollmentStats = (enrollmentStatsData || []) as EnrollmentStatType[];

  // Create a map of user enrollment stats
  const userStats = new Map<string, { total: number; completed: number }>();
  enrollmentStats.forEach((enrollment) => {
    const current = userStats.get(enrollment.user_id) || { total: 0, completed: 0 };
    current.total++;
    if (enrollment.status === 'completed') current.completed++;
    userStats.set(enrollment.user_id, current);
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their training assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/company-admin/team/invite"
            className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
          >
            Invite (CSV / Link)
          </Link>
          <Link
            href="/company-admin/team/new"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Add Team Member
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Members
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{teamMembers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Admins
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">
            {teamMembers.filter((m) => m.role === 'company_admin').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Learners
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">
            {teamMembers.filter((m) => m.role === 'user').length}
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const stats = userStats.get(member.id) || { total: 0, completed: 0 };
                  const progress = stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0;
                  const memberGroups = userGroups.get(member.id) || [];

                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {member.full_name?.[0] || member.email[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.full_name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {memberGroups.length > 0 ? (
                          <span title={memberGroups.join(', ')}>
                            {memberGroups.length === 1 ? memberGroups[0] : `${memberGroups.length} groups`}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-accent-500 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{progress}%</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {stats.completed} / {stats.total} completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TeamMemberActions
                          memberId={member.id}
                          memberEmail={member.email}
                          currentUserId={user.id}
                          memberRole={member.role}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No team members yet. Invite your first team member above.
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
