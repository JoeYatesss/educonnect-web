import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Marketing pages that don't require Supabase
  const marketingRoutes = ['/integration-guide', '/language-course', '/blog'];
  const isMarketingRoute = marketingRoutes.some(route => pathname.startsWith(route));

  // Skip Supabase entirely for marketing pages
  if (isMarketingRoute) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes (accessible without auth)
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Protected routes that require authentication
  const isTeacherRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/matches') || pathname.startsWith('/payment');
  const isAdminRoute = pathname.startsWith('/admin');

  // If not logged in and trying to access protected route
  if (!session && (isTeacherRoute || isAdminRoute)) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in, check user type and route access
  if (session) {
    // Get user profile to determine type (teacher vs admin)
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id, has_paid')
      .eq('user_id', session.user.id)
      .single();

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('id', session.user.id)
      .single();

    // Teacher trying to access admin routes
    if (teacher && isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Admin trying to access teacher routes
    if (admin && isTeacherRoute) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Redirect unpaid teachers trying to access matches
    if (teacher && !teacher.has_paid && pathname.startsWith('/matches')) {
      return NextResponse.redirect(new URL('/payment', req.url));
    }

    // Redirect logged-in users away from auth pages
    if (isPublicRoute && pathname !== '/') {
      if (teacher) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      if (admin) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|audio).*)',
  ],
};
