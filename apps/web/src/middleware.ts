import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes - anyone can access
  // Note: auth callback + password setup must be public, otherwise invite links
  // get redirected to /login before the client callback can set the session.
  const publicRoutes = ['/', '/login', '/signup'];
  if (publicRoutes.includes(path) || path.startsWith('/auth')) {
    return supabaseResponse;
  }

  // If no user and trying to access protected route, redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Get user role from profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  // If profile doesn't exist, default to 'user' role (learner)
  // This handles cases where users were created directly in Supabase Auth
  const role = profile?.role || 'user';

  // Role-based route protection
  if (path.startsWith('/super-admin') && role !== 'super_admin') {
    const url = request.nextUrl.clone();
    url.pathname = role === 'company_admin' ? '/company-admin' : '/learner';
    return NextResponse.redirect(url);
  }

  if (path.startsWith('/company-admin') && !['super_admin', 'company_admin'].includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = '/learner';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
