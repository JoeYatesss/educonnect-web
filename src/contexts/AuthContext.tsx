'use client';

import { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
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
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Track if we're currently fetching to prevent duplicates
  const fetchingRef = useRef(false);

  useEffect(() => {
    console.log('[AuthContext] useEffect MOUNTED - setting up auth listener');
    let mounted = true;
    let profileFetched = false;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] onAuthStateChange triggered:', event, 'Session exists:', !!session);

        if (!mounted) return;

        // Handle sign out / no session
        if (!session?.user) {
          setUser(null);
          setTeacher(null);
          setAdminUser(null);
          setProfileError(null);
          setLoading(false);
          profileFetched = false;
          return;
        }

        // Set user immediately
        setUser(session.user);

        if (event === 'INITIAL_SESSION') {
          // On app load, fetch profile and then set loading to false
          if (!profileFetched) {
            profileFetched = true;
            console.log('[AuthContext] INITIAL_SESSION - fetching profile');
            fetchUserProfile(session.user.id)
              .catch(error => {
                console.error('[AuthContext] Initial profile fetch failed:', error);
              })
              .finally(() => {
                if (mounted) {
                  setLoading(false);
                }
              });
          }
        } else if (event === 'SIGNED_IN') {
          // For explicit sign-in, profile is fetched synchronously by signIn()
          // Don't fetch here to avoid duplicate calls
          console.log('[AuthContext] SIGNED_IN event - profile already fetched by signIn()');
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refreshed, don't fetch profile again
          console.log('[AuthContext] TOKEN_REFRESHED event - keeping existing profile');
        } else {
          // For other events, just set loading false
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('[AuthContext] useEffect CLEANUP - unsubscribing auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchUserProfile = async (userId: string): Promise<void> => {
    // Prevent duplicate fetches
    if (fetchingRef.current) {
      console.log('[AuthContext] Already fetching profile, skipping...');
      return;
    }

    fetchingRef.current = true;
    console.log('[AuthContext] Fetching profile for user:', userId);
    setProfileLoading(true);
    setProfileError(null);

    try {
      const profileData = await apiClient.getCurrentUserProfile();
      console.log('[AuthContext] Profile data received:', profileData);

      if (profileData.teacher) {
        setTeacher(profileData.teacher);
        setAdminUser(null);
        console.log('[AuthContext] Teacher profile loaded');
      } else if (profileData.admin) {
        setAdminUser(profileData.admin);
        setTeacher(null);
        console.log('[AuthContext] Admin profile loaded');
      } else {
        // User exists in auth but not in teachers/admin tables
        console.warn('[AuthContext] User authenticated but no profile found');
        setTeacher(null);
        setAdminUser(null);
        setProfileError('Profile not found. Please complete your signup.');
        throw new Error('Profile not found');
      }
    } catch (error: any) {
      console.error('[AuthContext] Profile fetch error:', error);

      // Handle different error types
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setProfileError('Session expired. Please sign in again.');
        await signOut();
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        setProfileError('Access denied. Please contact support.');
      } else {
        setProfileError('Failed to load profile. Please try again.');
      }

      setTeacher(null);
      setAdminUser(null);
      throw error; // Re-throw so signIn can catch it
    } finally {
      setProfileLoading(false);
      fetchingRef.current = false;
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

    if (!data.user) {
      throw new Error('Authentication failed - no user returned');
    }

    // CRITICAL: Fetch profile synchronously BEFORE returning
    // This ensures profile is loaded when login page redirects to dashboard
    console.log('[AuthContext] User authenticated, fetching profile synchronously...');
    await fetchUserProfile(data.user.id);
    console.log('[AuthContext] signIn completed successfully with profile loaded');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setTeacher(null);
    setAdminUser(null);

    // Use window.location for a hard redirect to avoid middleware race condition
    window.location.href = '/';
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
    profileLoading,
    profileError,
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
