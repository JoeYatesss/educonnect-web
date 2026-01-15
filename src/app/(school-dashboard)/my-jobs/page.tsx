'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import { SchoolJobWithStats, SchoolJobStats } from '@/types';
import { Plus, Briefcase, Users, UserCheck, MoreVertical, Play, Edit2, Trash2, Eye } from 'lucide-react';

export default function MyJobsPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<SchoolJobWithStats[]>([]);
  const [stats, setStats] = useState<SchoolJobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && schoolAccount && !schoolAccount.has_paid) {
      router.push('/school-dashboard');
    }
  }, [authLoading, schoolAccount, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, statsData] = await Promise.all([
          apiClient.getSchoolJobs(),
          apiClient.getSchoolJobStats(),
        ]);
        setJobs(jobsData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    if (schoolAccount?.has_paid) {
      fetchData();
    }
  }, [schoolAccount]);

  const handleDelete = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job? This will also remove all matches and selections.')) {
      return;
    }

    setDeletingId(jobId);
    try {
      await apiClient.deleteSchoolJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      if (stats) {
        setStats({
          ...stats,
          active_jobs: stats.active_jobs - 1,
          total_jobs: stats.total_jobs - 1,
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete job');
    } finally {
      setDeletingId(null);
      setActiveMenu(null);
    }
  };

  const handleRunMatching = async (jobId: number) => {
    try {
      const result = await apiClient.runJobMatching(jobId);
      alert(result.message);
      // Refresh jobs to get updated match counts
      const jobsData = await apiClient.getSchoolJobs();
      setJobs(jobsData);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to run matching');
    }
    setActiveMenu(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (!schoolAccount?.has_paid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
              <p className="text-gray-600">
                Create job postings and find matching teachers
              </p>
            </div>
            {stats && stats.active_jobs < stats.max_jobs && (
              <Link
                href="/my-jobs/create"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Create New Job
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Active Jobs</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.active_jobs} / {stats.max_jobs}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Matches</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_matches}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Interview Selections</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_selections}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Jobs</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_jobs}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Jobs List */}
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Postings Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first job posting to start finding matching teachers.
              </p>
              <Link
                href="/my-jobs/create"
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            {job.city && <span>{job.city}</span>}
                            {job.salary_display && (
                              <>
                                <span>•</span>
                                <span>{job.salary_display}</span>
                              </>
                            )}
                            {job.subjects && job.subjects.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{job.subjects.join(', ')}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {!job.is_active && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{job.match_count}</p>
                          <p className="text-gray-500">Matches</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-600">{job.selection_count}</p>
                          <p className="text-gray-500">Selections</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/my-jobs/${job.id}`}
                          className="px-4 py-2 text-sm font-medium text-brand-red border border-brand-red rounded-lg hover:bg-brand-red hover:text-white transition-colors"
                        >
                          View Matches
                        </Link>

                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {activeMenu === job.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => handleRunMatching(job.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                Run Matching
                              </button>
                              <Link
                                href={`/my-jobs/${job.id}`}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                              <Link
                                href={`/my-jobs/${job.id}?edit=true`}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit Job
                              </Link>
                              <button
                                onClick={() => handleDelete(job.id)}
                                disabled={deletingId === job.id}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                {deletingId === job.id ? 'Deleting...' : 'Delete Job'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job Limit Warning */}
          {stats && stats.active_jobs >= stats.max_jobs && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800">
                You&apos;ve reached the maximum number of active job postings ({stats.max_jobs}).
                Please deactivate an existing job to create a new one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
