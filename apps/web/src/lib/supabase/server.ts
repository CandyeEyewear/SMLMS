import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function missingEnvError() {
  return new Error(
    [
      'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      '',
      'Fix:',
      '- Local dev: create `apps/web/.env.local` (copy from `apps/web/.env.example`) and set both values.',
      '- Deployment: set both variables in your hosting provider, then redeploy.',
    ].join('\n')
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw missingEnvError();
  }

  return createServerClient(supabaseUrl, supabaseAnonKey,
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
