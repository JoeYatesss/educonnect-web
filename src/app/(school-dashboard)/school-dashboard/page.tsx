'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import SchoolPaymentGate from '@/components/school/SchoolPaymentGate';
import { apiClient } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/client';
import { Search, Heart, Users, CheckCircle2, ArrowRight, Building2, Briefcase, UserCheck } from 'lucide-react';
import { SchoolJobStats } from '@/types';

function SchoolDashboardContent() {
  const { schoolAccount, teacher, adminUser, user, loading: authLoading, profileError, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [stats, setStats] = useState({
    saved_teachers_count: 0,
    has_paid: false,
    payment_date: null as string | null,
  });
  const [jobStats, setJobStats] = useState<SchoolJobStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Verify payment when returning from Stripe checkout
  useEffect(() => {
    const verifyPayment = async () => {
      const paymentStatus = searchParams.get('payment');
      const sessionId = searchParams.get('session_id');

      if (paymentStatus === 'success' && sessionId) {
        setVerifyingPayment(true);

        try {
          const result = await apiClient.verifySchoolPaymentSession(sessionId);

          if (result.paid) {
            setShowPaymentSuccess(true);
            // Refresh the page to get updated school data
            setTimeout(() => {
              window.location.href = '/school-dashboard';
            }, 2000);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          // Still show success - webhook may have processed it
          setShowPaymentSuccess(true);
          setTimeout(() => setShowPaymentSuccess(false), 5000);
        } finally {
          setVerifyingPayment(false);
        }
      } else if (paymentStatus === 'success') {
        setShowPaymentSuccess(true);
        setTimeout(() => setShowPaymentSuccess(false), 5000);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      // Fetch account stats
      try {
        const accountStats = await apiClient.getSchoolStats();
        setStats(accountStats);
      } catch (err) {
        console.error('Failed to fetch account stats:', err);
      }

      // Fetch job stats separately (only for paid schools)
      if (schoolAccount?.has_paid) {
        try {
          const schoolJobStats = await apiClient.getSchoolJobStats();
          setJobStats(schoolJobStats);
        } catch (err) {
          console.error('Failed to fetch job stats:', err);
          // Set defaults on error
          setJobStats({ active_jobs: 0, max_jobs: 5, total_jobs: 0, total_matches: 0, total_selections: 0 });
        }
      }

      setStatsLoading(false);
    };

    if (schoolAccount) {
      fetchStats();
    }
  }, [schoolAccount]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Redirect teachers to their dashboard
  useEffect(() => {
    if (!authLoading && teacher && !schoolAccount) {
      router.push('/dashboard');
    }
  }, [authLoading, teacher, schoolAccount, router]);

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && adminUser && !schoolAccount) {
      router.push('/admin');
    }
  }, [authLoading, adminUser, schoolAccount, router]);

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
  if (!schoolAccount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome, {schoolAccount.school_name}!
              </h1>
              <p className="text-lg text-gray-600">
                Find the perfect teachers for your school
              </p>
            </div>
            {schoolAccount.has_paid && (
              <div className="mt-4 md:mt-0">
                <Link
                  href="/find-talent"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  Browse Teachers
                </Link>
              </div>
            )}
          </div>
        </div>
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
                  You now have full access to browse all teacher profiles and download CVs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Gate (if unpaid) */}
        <SchoolPaymentGate />

        {/* Quick Stats */}
        {schoolAccount.has_paid && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Saved Teachers</p>
                  <p className="text-xl font-bold text-gray-900">
                    {statsLoading ? '...' : stats.saved_teachers_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Active Jobs</p>
                  <p className="text-xl font-bold text-gray-900">
                    {statsLoading ? '...' : `${jobStats?.active_jobs || 0}/${jobStats?.max_jobs || 5}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Interviews</p>
                  <p className="text-xl font-bold text-gray-900">
                    {statsLoading ? '...' : jobStats?.total_selections || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total Matches</p>
                  <p className="text-xl font-bold text-gray-900">
                    {statsLoading ? '...' : jobStats?.total_matches || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Location</p>
                  <p className="text-lg font-semibold text-gray-900 truncate max-w-[120px]">{schoolAccount.city}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {schoolAccount.has_paid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/find-talent"
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-red/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                  <Search className="w-6 h-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">
                    Find Talent
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Browse our database of qualified teachers and find the perfect match for your school.
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-red font-medium text-sm group-hover:gap-2 transition-all">
                    Start searching
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/my-jobs"
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-red/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">
                    My Jobs
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Create job postings and run matching to find teachers that fit your requirements.
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-red font-medium text-sm group-hover:gap-2 transition-all">
                    Manage jobs
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/interview-selections"
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-red/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">
                    Interview Selections
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Track teachers selected for interviews and manage the hiring pipeline.
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-red font-medium text-sm group-hover:gap-2 transition-all">
                    View selections
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/saved-teachers"
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-red/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">
                    Saved Teachers
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Review teachers you&apos;ve bookmarked and manage your shortlist.
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-red font-medium text-sm group-hover:gap-2 transition-all">
                    View saved
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-500 mb-1">
                    Find Talent
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Browse our database of qualified teachers and find the perfect match for your school.
                  </p>
                  <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-sm">
                    Unlock with payment
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-500 mb-1">
                    Saved Teachers
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Review teachers you&apos;ve bookmarked and manage your shortlist.
                  </p>
                  <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-sm">
                    Unlock with payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our team is here to assist you with your recruitment needs. Contact us for personalized support.
          </p>
          <a
            href="mailto:team@educonnectchina.com"
            className="inline-flex items-center gap-2 text-brand-red font-medium hover:underline"
          >
            Contact School Support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SchoolDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SchoolDashboardContent />
    </Suspense>
  );
}
