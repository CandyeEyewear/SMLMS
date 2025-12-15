'use server';

import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
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

export async function inviteCompanyAdmin(
  companyId: string,
  email: string,
  fullName: string
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const appUrl = getAppUrl();

    // 1. Invite user via Supabase Auth (sends email automatically)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        company_id: companyId,
        role: 'company_admin',
      },
      redirectTo: `${appUrl}/auth/callback`,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // 2. Create profile for the user
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'company_admin',
      company_id: companyId,
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, userId: authData.user.id };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
