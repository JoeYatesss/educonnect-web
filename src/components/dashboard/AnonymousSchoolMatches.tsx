'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SchoolMatch {
  id: number;
  city: string;
  province: string;
  school_type: string;
  age_groups: string[];
  salary_range: string;
  match_score: number;
  match_reasons: string[];
}

export default function AnonymousSchoolMatches() {
  const { teacher } = useAuth();
  const [matches, setMatches] = useState<SchoolMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacher?.has_paid) {
      setLoading(false);
      return;
    }

    fetchMatches();
  }, [teacher]);

  const fetchMatches = async () => {
    try {
      // TODO: Implement actual API call
      // For now, show placeholder
      setMatches([]);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
      setLoading(false);
    }
  };

  if (!teacher?.has_paid) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">School Matches</h2>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <p className="mt-4 text-gray-500">Complete payment to view your matched schools</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">School Matches</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">School Matches</h2>
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">School Matches</h2>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <p className="mt-4 text-gray-500">
            We're currently finding the best school matches for you
          </p>
          <p className="mt-2 text-sm text-gray-400">
            You'll be notified when matches are available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Your School Matches ({matches.length})
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {matches.length} matches found
        </span>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {match.city}, {match.province}
                  </span>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {match.match_score}% match
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {match.school_type}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {match.age_groups.join(', ')}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {match.salary_range}
                  </span>
                </div>

                {match.match_reasons.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 font-medium">Why this is a good match:</p>
                    <ul className="mt-1 space-y-1">
                      {match.match_reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-500 flex items-start">
                          <svg
                            className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> School names are kept confidential to protect the matching process.
          Our team will submit your application to the best matched schools on your behalf.
        </p>
      </div>
    </div>
  );
}
