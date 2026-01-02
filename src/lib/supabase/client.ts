import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Supabase client for use in Client Components
 * Uses anon key (safe for browser)
 */
export const createClient = () => {
  return createClientComponentClient();
};
