'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_APP_URL');
  }
  return appUrl;
}

async function requireCompanyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, company_id')
    .eq('id', user.id)
    .single<{ role: string; company_id: string | null }>();

  if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
    redirect('/login');
  }

  return { userId: user.id, companyId: profile.company_id };
}

async function addUserToGroups(userId: string, groupIds: string[]) {
  if (!groupIds.length) return;

  const memberships = groupIds.map((groupId) => ({
    group_id: groupId,
    user_id: userId,
  }));

  // Best-effort insert (ignore duplicates)
  await getSupabaseAdmin().from('group_members' as never).insert(memberships as never);
}

async function inviteOrAttachUserToCompany(params: {
  companyId: string;
  invitedBy: string;
  email: string;
  fullName?: string;
  groupIds?: string[];
}) {
  const email = params.email.trim().toLowerCase();
  const fullName = (params.fullName || '').trim();
  const groupIds = params.groupIds || [];

  // If profile already exists, attach to company when possible
  const { data: existingProfile } = await getSupabaseAdmin()
    .from('profiles')
    .select('id, company_id')
    .eq('email', email)
    .single<{ id: string; company_id: string | null }>();

  if (existingProfile) {
    if (existingProfile.company_id === params.companyId) {
      return { ok: false, error: 'User is already a member of your company.' };
    }

    if (existingProfile.company_id) {
      return { ok: false, error: 'User is already a member of another company.' };
    }

    const { error: updateError } = await getSupabaseAdmin()
      .from('profiles')
      .update({
        company_id: params.companyId,
        role: 'user',
        full_name: fullName || null,
      } as never)
      .eq('id', existingProfile.id);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    await addUserToGroups(existingProfile.id, groupIds);
    return { ok: true, userId: existingProfile.id, invited: false };
  }

  // Otherwise invite via Supabase Auth (sends email)
  const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      company_id: params.companyId,
      role: 'user',
    },
    redirectTo: `${getAppUrl()}/auth/callback`,
  });

  if (authError) {
    return { ok: false, error: authError.message };
  }

  // Ensure profile exists and is attached
  const { error: profileError } = await getSupabaseAdmin()
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email,
      full_name: fullName || null,
      role: 'user',
      company_id: params.companyId,
    } as never);

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  await addUserToGroups(authData.user.id, groupIds);

  return { ok: true, userId: authData.user.id, invited: true };
}

export type InviteUserState = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function inviteCompanyUserAction(
  _prevState: InviteUserState,
  formData: FormData
): Promise<InviteUserState> {
  const { companyId, userId } = await requireCompanyAdmin();

  const email = String(formData.get('email') || '');
  const fullName = String(formData.get('fullName') || '');
  const groupIds = formData.getAll('groupIds').map(String).filter(Boolean);

  if (!email) {
    return { ok: false, error: 'Email is required.' };
  }

  const result = await inviteOrAttachUserToCompany({
    companyId,
    invitedBy: userId,
    email,
    fullName,
    groupIds,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return {
    ok: true,
    message: result.invited ? 'Invitation sent successfully.' : 'User added to your company.' ,
  };
}

export type BulkInviteState = {
  ok: boolean;
  error?: string;
  results?: Array<{ email: string; ok: boolean; message: string }>;
};

function parseCsv(csv: string): Array<{ email: string; fullName?: string }> {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  // Support optional header row
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('email');
  const startIndex = hasHeader ? 1 : 0;

  const out: Array<{ email: string; fullName?: string }> = [];
  for (let i = startIndex; i < lines.length; i++) {
    const [email, fullName] = lines[i].split(',').map((v) => v.trim());
    if (!email) continue;
    out.push({ email, fullName });
  }
  return out;
}

export async function bulkInviteCompanyUsersAction(
  _prevState: BulkInviteState,
  formData: FormData
): Promise<BulkInviteState> {
  const { companyId, userId } = await requireCompanyAdmin();

  const csvText = String(formData.get('csv') || '');
  const groupIds = formData.getAll('groupIds').map(String).filter(Boolean);

  const rows = parseCsv(csvText);
  if (!rows.length) {
    return { ok: false, error: 'Please provide a CSV with at least one email.' };
  }

  const results: Array<{ email: string; ok: boolean; message: string }> = [];

  for (const row of rows) {
    const res = await inviteOrAttachUserToCompany({
      companyId,
      invitedBy: userId,
      email: row.email,
      fullName: row.fullName,
      groupIds,
    });

    results.push({
      email: row.email,
      ok: res.ok,
      message: res.ok
        ? res.invited
          ? 'Invited'
          : 'Added'
        : (res.error || 'Failed'),
    });
  }

  return { ok: true, results };
}

export type InviteLinkState = {
  ok: boolean;
  error?: string;
  inviteUrl?: string;
};

export async function createInviteLinkAction(
  _prevState: InviteLinkState
): Promise<InviteLinkState> {
  const { companyId, userId } = await requireCompanyAdmin();

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await getSupabaseAdmin()
    .from('invite_links' as never)
    .insert({
      token,
      company_id: companyId,
      created_by: userId,
      role: 'user',
      expires_at: expiresAt,
    } as never);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, inviteUrl: `${getAppUrl()}/signup?invite=${token}` };
}
