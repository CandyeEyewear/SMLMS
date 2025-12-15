import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { InvitePageClient } from './invite-page-client';
import { bulkInviteCompanyUsersAction, createInviteLinkAction } from '../actions';

type ProfileType = {
  id: string;
  role: string;
  company_id: string | null;
};

type GroupType = {
  id: string;
  name: string;
};

export default async function TeamInvitePage() {
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

  const { data: groupsData } = await supabase
    .from('groups')
    .select('id, name')
    .eq('company_id', profile.company_id)
    .order('name');

  const groups = (groupsData || []) as GroupType[];

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/company-admin/team"
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Team
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Invite Team Members</h1>
        <p className="text-gray-500 mt-1">Bulk invite via CSV or generate a shareable link</p>
      </div>

      <InvitePageClient
        groups={groups}
        bulkInviteAction={bulkInviteCompanyUsersAction}
        createInviteLinkAction={createInviteLinkAction}
      />
    </div>
  );
}
