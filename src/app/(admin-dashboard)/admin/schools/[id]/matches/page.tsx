'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TeacherMatch {
  match_id: number;
  match_score: number;
  match_reasons: string[];
  is_submitted: boolean;
  teacher_id: number;
  teacher_name: string;
  teacher_email: string;
  subject_specialty: string | null;
  preferred_location: string | null;
  preferred_age_group: string | null;
  years_experience: string | null;
  status: string;
  has_paid: boolean;
}

interface School {
  id: number;
  name: string;
  city: string;
  province: string;
  school_type: string;
  age_groups: string[];
  subjects_needed: string[];
  salary_range: string;
}

export default function SchoolMatchesPage() {
  const { adminUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const schoolId = parseInt(params.id as string, 10);

  const [school, setSchool] = useState<School | null>(null);
  const [matches, setMatches] = useState<TeacherMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(50);
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/login');
    } else if (adminUser && schoolId) {
      fetchData();
    }
  }, [adminUser, authLoading, schoolId]);

  const fetchData = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      // Fetch school info and matches in parallel
      const [schoolRes, matchesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/schools/${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/matching/school/${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (schoolRes.ok) {
        const schoolData = await schoolRes.json();
        setSchool(schoolData);
      }

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const meetsScore = match.match_score >= minScore;
    const meetsPaid = !showPaidOnly || match.has_paid;
    return meetsScore && meetsPaid;
  });

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      document_verification: 'bg-blue-100 text-blue-800',
      school_matching: 'bg-purple-100 text-purple-800',
      interview_scheduled: 'bg-indigo-100 text-indigo-800',
      interview_completed: 'bg-cyan-100 text-cyan-800',
      offer_extended: 'bg-green-100 text-green-800',
      placed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Matched Teachers
              </h1>
              {school && (
                <p className="mt-1 text-sm text-gray-500">
                  {school.name} - {school.city}, {school.province}
                </p>
              )}
            </div>
            <Link
              href="/admin/schools"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Schools
            </Link>
          </div>
        </div>
      </div>

      {/* School Info Card */}
      {school && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">School Type</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">{school.school_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age Groups</p>
                <p className="mt-1 text-sm text-gray-900">{school.age_groups.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subjects Needed</p>
                <p className="mt-1 text-sm text-gray-900">{school.subjects_needed.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Salary Range</p>
                <p className="mt-1 text-sm text-green-600 font-medium">{school.salary_range}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Min Score:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600 w-12">{minScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="paidOnly"
                checked={showPaidOnly}
                onChange={(e) => setShowPaidOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="paidOnly" className="text-sm text-gray-700">
                Show paid teachers only
              </label>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredMatches.length} of {matches.length} matches
            </div>
          </div>
        </div>

        {/* Matches Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Reasons
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No matching teachers found. Try lowering the minimum score filter.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((match) => (
                  <tr key={match.match_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {match.teacher_name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">{match.teacher_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-lg font-bold ${getScoreColor(match.match_score)}`}>
                        {match.match_score.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {match.subject_specialty || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {match.years_experience || 'N/A'} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(match.status)}`}>
                        {match.status?.replace(/_/g, ' ') || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {match.has_paid ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {match.match_reasons && match.match_reasons.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {match.match_reasons.slice(0, 3).map((reason, idx) => (
                              <li key={idx} className="truncate max-w-xs">{reason}</li>
                            ))}
                          </ul>
                        ) : (
                          'No specific reasons'
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
