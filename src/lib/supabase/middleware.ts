import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Supabase client for use in Next.js middleware
 * Handles session refresh and cookie management
 */
export const createClient = (req: NextRequest) => {
  const res = NextResponse.next();
  return createMiddlewareClient({ req, res });
};
