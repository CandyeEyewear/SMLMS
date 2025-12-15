import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@sm-lms/database';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore errors in Server Components
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get user and their role to redirect appropriately
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // If user signed up through an invite link, attach them to the company
        const inviteToken = (user.user_metadata as { invite_token?: string } | null)?.invite_token;
        if (inviteToken) {
          try {
            const supabaseAdmin = createAdminClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
              { auth: { autoRefreshToken: false, persistSession: false } }
            );

            const supabaseAdminAny = supabaseAdmin as unknown as {
              from: (table: string) => ReturnType<typeof supabaseAdmin.from>;
            };

            const { data: link } = await supabaseAdminAny
              .from('invite_links')
              .select('company_id, expires_at')
              .eq('token', inviteToken)
              .single();

            if (link) {
              const expiresAt = (link as { expires_at?: string | null }).expires_at;
              const isExpired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;

              if (!isExpired) {
                const companyId = (link as { company_id: string }).company_id;
                await supabaseAdminAny.from('profiles').upsert({
                  id: user.id,
                  email: user.email || '',
                  company_id: companyId,
                  role: 'user',
                });

                await supabaseAdminAny
                  .from('invite_links')
                  .update({ used_by: user.id, used_at: new Date().toISOString() })
                  .eq('token', inviteToken);
              }
            }
          } catch {
            // ignore invite-link errors
          }
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single<{ role: string }>();

        if (profile) {
          const roleRoutes: Record<string, string> = {
            super_admin: '/super-admin',
            company_admin: '/company-admin',
            user: '/learner',
          };
          const redirectPath = roleRoutes[profile.role as keyof typeof roleRoutes] || '/learner';
          return NextResponse.redirect(`${origin}${redirectPath}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
