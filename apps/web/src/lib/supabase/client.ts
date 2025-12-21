import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw missingEnvError();
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
