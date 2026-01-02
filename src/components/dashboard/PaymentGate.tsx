'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentGate() {
  const { teacher } = useAuth();

  if (!teacher || teacher.has_paid) {
    return null;
  }

  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-6 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-blue-900">
            Unlock Your Teaching Opportunities
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              Complete your payment to access:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>View matched schools with your profile</li>
              <li>See salary ranges and locations</li>
              <li>Track your application progress</li>
              <li>Get connected with top schools in China</li>
            </ul>
          </div>
          <div className="mt-4">
            <Link
              href="/payment"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Payment ($99)
              <svg
                className="ml-2 -mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
