import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Supabase client for use in Server Components and API Routes
 * Automatically handles cookie-based session management
 */
export const createClient = () => {
  return createServerComponentClient({ cookies });
};
