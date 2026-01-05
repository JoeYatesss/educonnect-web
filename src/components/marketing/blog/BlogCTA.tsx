'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export function BlogCTA() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isLoggedIn === null) {
      // Still loading auth state, wait
      return;
    }

    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="mt-12 p-8 bg-gradient-to-br from-brand-red to-red-600 rounded-xl text-white text-center">
      <h3 className="text-2xl font-bold mb-3">
        Ready to Start Your Teaching Journey in China?
      </h3>
      <p className="text-lg text-white/90 mb-6">
        {isLoggedIn
          ? "Access your dashboard to manage your profile and applications."
          : "Explore teaching opportunities and find your perfect match in China."}
      </p>
      <Link
        href="#"
        onClick={handleClick}
        className="inline-block px-8 py-3 bg-white text-brand-red rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        {isLoggedIn === null
          ? "Loading..."
          : isLoggedIn
            ? "Go to Dashboard"
            : "See Job Matches"}
      </Link>
    </div>
  );
}
