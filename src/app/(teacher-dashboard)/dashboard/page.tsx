'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import PaymentGate from '@/components/dashboard/PaymentGate';
import AnonymousSchoolMatches from '@/components/dashboard/AnonymousSchoolMatches';
import ProfileCompletionWizard from '@/components/dashboard/ProfileCompletionWizard';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import ApplicationsList from '@/components/dashboard/ApplicationsList';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, User, Settings, TrendingUp, Building2, CheckCircle2, ArrowRight, Mail } from 'lucide-react';

function DashboardContent() {
  const { teacher, adminUser, user, loading: authLoading, profileError, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [stats, setStats] = useState({
    match_count: 0,
    application_count: 0,
    profile_completeness: 0,
    has_paid: false
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Verify payment when returning from Stripe checkout
  useEffect(() => {
    const verifyPayment = async () => {
      const paymentStatus = searchParams.get('payment');
      const sessionId = searchParams.get('session_id');

      if (paymentStatus === 'success' && sessionId) {
        setVerifyingPayment(true);

        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            const response = await fetch(`${API_URL}/api/v1/payments/verify-session`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ session_id: sessionId }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log('[Dashboard] Payment verification result:', result);

              if (result.verified || result.already_processed) {
                setShowPaymentSuccess(true);
                // Refresh the page to get updated teacher data (remove query params)
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 2000);
              }
            } else {
              console.error('[Dashboard] Payment verification failed:', await response.text());
              // Still show success message even if verification fails
              // (webhook may have already processed it)
              setShowPaymentSuccess(true);
              setTimeout(() => setShowPaymentSuccess(false), 5000);
            }
          }
        } catch (error) {
          console.error('[Dashboard] Error verifying payment:', error);
          setShowPaymentSuccess(true);
          setTimeout(() => setShowPaymentSuccess(false), 5000);
        } finally {
          setVerifyingPayment(false);
        }
      } else if (paymentStatus === 'success') {
        // Fallback for old URLs without session_id
        setShowPaymentSuccess(true);
        setTimeout(() => setShowPaymentSuccess(false), 5000);
      }
    };

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (teacher) {
      fetchStats();
    }
  }, [teacher]);

  useEffect(() => {
    // Only redirect if done loading, no user, and no teacher
    if (!authLoading && !user && !teacher) {
      router.push('/login');
    }
  }, [authLoading, user, teacher, router]);

  // Redirect admin users to /admin
  useEffect(() => {
    if (!authLoading && adminUser && !teacher) {
      router.push('/admin');
    }
  }, [authLoading, adminUser, teacher, router]);

  // Check if profile is complete and show wizard if needed
  // This must be before any conditional returns to maintain hook order
  // Note: intro_video_path is optional for legacy users (grandfathered)
  // New users (v2 signup) upload all files during registration, so wizard won't show for them
  // Legacy users who are missing CV or headshot will see the wizard
  const isProfileComplete = teacher?.cv_path && teacher?.headshot_photo_path;

  useEffect(() => {
    if (teacher && !isProfileComplete) {
      setShowWizard(true);
    }
  }, [teacher, isProfileComplete]);

  // Show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if profile failed to load
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-gray-600 mb-6">{profileError}</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect handled by useEffect
  if (!teacher) {
    return null;
  }

  // Use backend-calculated profile completeness (defaults to 0 if not available)
  const profileCompleteness = teacher.profile_completeness ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-6 h-20 max-w-7xl">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
                EduConnect
              </span>
              <span
                className="text-brand-red font-chinese text-[1.75rem] font-bold group-hover:scale-105 transition-transform duration-200 italic"
                style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}
              >
                中国
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-brand-red font-semibold text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/matches"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Matches
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile
              </Link>
              <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-6">
                <span className="text-sm text-gray-600">
                  {teacher.first_name} {teacher.last_name}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu - Sign Out */}
            <div className="md:hidden">
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {teacher.first_name}!
              </h1>
              <p className="text-lg text-gray-600">
                Track your progress and discover new opportunities
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-red rounded-lg shadow-sm text-sm font-semibold text-brand-red bg-white hover:bg-red-50 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Success Message */}
        {showPaymentSuccess && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  Payment Successful!
                </h3>
                <p className="text-sm text-green-700">
                  You now have full access to the platform and can view all your school matches.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Gate (if unpaid) */}
        <PaymentGate />

        {/* Profile Completeness */}
        {profileCompleteness < 100 && (
          <div className="mb-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-brand-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">Complete Your Profile</h3>
                  <span className="text-sm font-bold text-brand-red bg-red-50 px-3 py-1 rounded-full">
                    {profileCompleteness}% complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-brand-red to-red-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  A complete profile helps you get better matches with schools.{' '}
                  <Link href="/profile" className="text-brand-red hover:text-red-600 font-semibold inline-flex items-center gap-1 group">
                    Continue editing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Applications Section - At the top */}
        <div className="mb-6">
          <ApplicationsList />
        </div>

        {/* School Matches Section */}
        <div>
          <AnonymousSchoolMatches />
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          actions={[
            {
              label: 'Update Profile',
              icon: User,
              href: '/profile'
            },
            {
              label: 'View Matches',
              icon: Building2,
              href: '/matches'
            },
            {
              label: 'Contact Support',
              icon: Mail,
              href: 'mailto:support@educonnect.com'
            }
          ]}
        />

        {/* Profile Completion Wizard Modal */}
        {showWizard && !isProfileComplete && (
          <ProfileCompletionWizard onComplete={() => {
            setShowWizard(false);
            window.location.reload();
          }} />
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
