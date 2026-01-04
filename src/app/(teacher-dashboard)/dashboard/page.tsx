'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import PaymentGate from '@/components/dashboard/PaymentGate';
import ProgressTracker from '@/components/dashboard/ProgressTracker';
import AnonymousSchoolMatches from '@/components/dashboard/AnonymousSchoolMatches';
import Link from 'next/link';

function DashboardContent() {
  const { teacher, adminUser, user, loading: authLoading, profileError, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setShowPaymentSuccess(true);
      // Remove query param after showing message
      setTimeout(() => setShowPaymentSuccess(false), 5000);
    }
  }, [searchParams]);

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

  // Show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {teacher.first_name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your application progress and manage your profile
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit Profile
              </Link>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Success Message */}
        {showPaymentSuccess && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Payment successful! You now have full access to the platform.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Gate (if unpaid) */}
        <PaymentGate />

        {/* Profile Completeness */}
        {profileCompleteness < 100 && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
              <span className="text-sm font-medium text-gray-600">
                {profileCompleteness}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Complete your profile to improve your matches.{' '}
              <Link href="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
                Continue editing →
              </Link>
            </p>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProgressTracker currentStatus={teacher.status} />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">School Matches</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {teacher.has_paid ? '0' : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <AnonymousSchoolMatches />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="ml-3 font-medium text-gray-900">Update Profile</span>
            </Link>

            <Link
              href="/matches"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="ml-3 font-medium text-gray-900">View Matches</span>
            </Link>

            <a
              href="mailto:support@educonnect.com"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="ml-3 font-medium text-gray-900">Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
