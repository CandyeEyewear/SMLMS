// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GroupForm } from './group-form';
import { GroupActions } from './group-actions';

// Type definitions
type ProfileType = {
  id: string;
  role: string;
  company_id: string | null;
};

type GroupType = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

type GroupMemberType = {
  group_id: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
};

type TeamMemberType = {
  id: string;
  email: string;
  full_name: string | null;
};

export default async function GroupsPage() {
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

  // Fetch groups
  const { data: groupsData } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      description,
      created_at
    `)
    .eq('company_id', profile.company_id)
    .order('name');

  const groups = (groupsData || []) as GroupType[];

  // Fetch group members with user details
  const { data: groupMembersData } = await supabase
    .from('group_members')
    .select(`
      group_id,
      user_id,
      user:profiles(id, email, full_name)
    `)
    .in('group_id', groups.map((g) => g.id));

  const groupMembers = (groupMembersData || []) as GroupMemberType[];

  // Create a map of group members
  const groupMembersMap = new Map<string, Array<{ id: string; email: string; full_name: string | null }>>();
  groupMembers.forEach((member) => {
    if (!member.user) return;
    const current = groupMembersMap.get(member.group_id) || [];
    current.push({
      id: member.user.id,
      email: member.user.email,
      full_name: member.user.full_name,
    });
    groupMembersMap.set(member.group_id, current);
  });

  // Fetch team members for the form
  const { data: teamMembersData } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('company_id', profile.company_id)
    .order('full_name');

  const teamMembers = (teamMembersData || []) as TeamMemberType[];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ lineHeight: '1.2' }}>Groups</h1>
          <p className="text-gray-600 mt-1">
            Organize team members into groups for easier course assignments.
          </p>
        </div>
        <GroupForm companyId={profile.company_id} teamMembers={teamMembers} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Groups
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{groups.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Members in Groups
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">
            {Array.from(groupMembersMap.values()).reduce((sum, members) => sum + members.length, 0)}
          </p>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Groups</h2>
        </div>

        {groups.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {groups.map((group) => {
              const members = groupMembersMap.get(group.id) || [];
              const memberCount = members.length;

              return (
                <div key={group.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {group.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900">{group.name}</h3>
                          <span className="text-sm text-gray-500">({memberCount} {memberCount === 1 ? 'member' : 'members'})</span>
                        </div>
                        {group.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mb-2">{group.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <GroupActions
                      groupId={group.id}
                      groupName={group.name}
                      memberCount={memberCount}
                    />
                  </div>
                  
                  {/* Team Members List */}
                  {members.length > 0 ? (
                    <div className="ml-16 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {member.full_name?.[0] || member.email[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700">
                              {member.full_name || member.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="ml-16 mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-400 italic">No members in this group yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No groups yet. Create your first group above to organize your team.
          </div>
        )}
      </div>
    </div>
  );
}
