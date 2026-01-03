'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';
import type { AuthContextType, Teacher, AdminUser } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial user (secure - verifies with auth server)
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          await fetchUserProfile(user.id);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] onAuthStateChange triggered:', event);

        // Set user immediately
        setUser(session?.user ?? null);

        if (session?.user) {
          // Don't block on profile fetching - let it happen in background
          // This allows login to redirect immediately
          console.log('[AuthContext] User signed in, fetching profile in background...');

          // Fetch profile asynchronously without blocking
          setTimeout(async () => {
            try {
              await fetchUserProfile(session.user.id);
            } catch (error) {
              console.error('[AuthContext] Error fetching profile:', error);
            }
          }, 500); // Wait 500ms to ensure session is fully stored
        } else {
          setTeacher(null);
          setAdminUser(null);
        }

        // Don't set loading during sign in events - let the page handle its own loading
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchUserProfile = async (userId: string) => {
    console.log('[AuthContext] Fetching profile for user:', userId);

    try {
      // Fetch user profile from backend API (includes teacher and admin data)
      console.log('[AuthContext] Calling apiClient.getCurrentUserProfile()...');
      const profileData = await apiClient.getCurrentUserProfile();
      console.log('[AuthContext] User profile loaded from API:', profileData);

      if (profileData.teacher) {
        setTeacher(profileData.teacher);
        setAdminUser(null);
        console.log('Teacher profile loaded');
      } else if (profileData.admin) {
        setAdminUser(profileData.admin);
        setTeacher(null);
        console.log('Admin profile loaded');
      } else {
        // User exists in auth but not in teachers or admin_users
        console.warn('User not found in teachers or admin_users tables');
        setTeacher(null);
        setAdminUser(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error.message);
      setTeacher(null);
      setAdminUser(null);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] signIn called');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('[AuthContext] signInWithPassword result:', {
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message
    });

    if (error) {
      // Provide helpful error messages
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
      }
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      throw error;
    }

    console.log('[AuthContext] signIn completed successfully, returning...');
    // Session is automatically stored by Supabase
    // The onAuthStateChange listener will handle fetching the profile
    // Just return and let the login page redirect
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setTeacher(null);
    setAdminUser(null);
    router.push('/');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  };

  const value = {
    user,
    teacher,
    adminUser,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
