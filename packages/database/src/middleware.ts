import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  company_admin: '/company-admin',
  user: '/learner',
};

const PROTECTED_ROUTES = ['/super-admin', '/company-admin', '/learner'];
const AUTH_ROUTES = ['/login', '/signup'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // If not authenticated and trying to access protected route, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated
  if (user) {
    // Get user's profile and role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    const userRole = profile?.role || 'user';
    const correctDashboard = ROLE_ROUTES[userRole] || '/learner';

    // If on auth route, redirect to correct dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = correctDashboard;
      return NextResponse.redirect(url);
    }

    // If on a protected route, check if user has access
    if (isProtectedRoute) {
      const hasAccess = pathname.startsWith(correctDashboard);

      // If user is on wrong dashboard, redirect to correct one
      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = correctDashboard;
        return NextResponse.redirect(url);
      }
    }

    // If on root path, redirect to correct dashboard
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = correctDashboard;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
