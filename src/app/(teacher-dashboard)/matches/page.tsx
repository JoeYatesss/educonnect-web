'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AnonymousSchoolMatches from '@/components/dashboard/AnonymousSchoolMatches';
import Link from 'next/link';

export default function MatchesPage() {
  const { teacher, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!teacher) {
    router.push('/login');
    return null;
  }

  // Middleware should have redirected unpaid users, but double-check
  if (!teacher.has_paid) {
    router.push('/payment');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your School Matches</h1>
              <p className="mt-1 text-sm text-gray-500">
                Schools that best match your profile and preferences
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How Matching Works</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Our algorithm analyzes your profile and matches you with schools based on:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Location preferences (35% weight)</li>
                  <li>Subject specialty (25% weight)</li>
                  <li>Age group preferences (20% weight)</li>
                  <li>Experience level (15% weight)</li>
                  <li>Chinese language requirement (5% weight)</li>
                </ul>
                <p className="mt-2">
                  <strong>Note:</strong> School names are kept confidential. We'll submit your
                  application to the best matches on your behalf.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Component */}
        <AnonymousSchoolMatches />

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need More Matches?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              If you're not seeing enough matches or want to improve your match score:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <Link href="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
                  Complete your profile
                </Link>{' '}
                with all details
              </li>
              <li>Upload all required documents (CV, video, photo)</li>
              <li>Broaden your location or subject preferences</li>
              <li>
                Contact our support team at{' '}
                <a
                  href="mailto:support@educonnect.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@educonnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
