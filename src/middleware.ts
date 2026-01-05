import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Marketing pages that don't require authentication
  const marketingRoutes = [
    '/about',
    '/requirements',
    '/integration-guide',
    '/language-course',
    '/blog',
    '/contact',
    '/legal'
  ];
  const isMarketingRoute = marketingRoutes.some(route => pathname.startsWith(route));

  if (isMarketingRoute) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get authenticated user (secure - verifies with auth server)
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
  if (!session?.user && (isTeacherRoute || isAdminRoute)) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and on login/signup page, check redirectTo param or use default
  if (session?.user && (pathname === '/login' || pathname === '/signup')) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo');
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    // Default: redirect to dashboard (teacher dashboard will redirect admins to /admin)
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|audio).*)',
  ],
};
