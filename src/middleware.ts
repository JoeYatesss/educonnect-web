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
    '/legal',
    '/for-schools'
  ];
  const isMarketingRoute = marketingRoutes.some(route => pathname.startsWith(route));

  if (isMarketingRoute) {
    return res;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
    );
    // For marketing routes, we can continue without auth, but for protected routes this would fail
    // Since we're past the marketing route check, return an error response
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase credentials' },
      { status: 500 }
    );
  }

  const supabase = createServerClient(supabaseUrl, anonKey, {
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
  });

  // Get authenticated user (secure - verifies with auth server)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes (accessible without auth)
  const publicRoutes = ['/', '/login', '/signup', '/school-signup', '/forgot-password', '/reset-password', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Protected routes that require authentication
  const isTeacherRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/matches') || pathname.startsWith('/payment');
  const isAdminRoute = pathname.startsWith('/admin');
  const isSchoolRoute = pathname.startsWith('/school-dashboard') || pathname.startsWith('/find-talent') || pathname.startsWith('/saved-teachers') || pathname.startsWith('/school-account') || pathname.startsWith('/school-payment');

  // If not logged in and trying to access protected route
  if (!session?.user && (isTeacherRoute || isAdminRoute || isSchoolRoute)) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and on login/signup page, check redirectTo param or use default
  if (session?.user && (pathname === '/login' || pathname === '/signup' || pathname === '/school-signup')) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo');
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    // Default: redirect to dashboard (teacher dashboard will redirect admins to /admin, schools to /school-dashboard)
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|audio).*)',
  ],
};
