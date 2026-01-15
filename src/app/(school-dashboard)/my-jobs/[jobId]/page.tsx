'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import { SchoolJobWithStats, SchoolJobMatch, TeacherFull } from '@/types';
import {
  ArrowLeft, Play, Users, UserCheck, MapPin, Briefcase,
  GraduationCap, Clock, FileText, Video, Image, CheckCircle
} from 'lucide-react';

export default function JobDetailPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = parseInt(params.jobId as string);

  const [job, setJob] = useState<SchoolJobWithStats | null>(null);
  const [matches, setMatches] = useState<SchoolJobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [runningMatching, setRunningMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectingId, setSelectingId] = useState<number | null>(null);

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
    const fetchJob = async () => {
      try {
        const jobData = await apiClient.getSchoolJob(jobId);
        setJob(jobData);

        // Fetch matches
        setMatchesLoading(true);
        const matchesData = await apiClient.getJobMatches(jobId);
        setMatches(matchesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job');
      } finally {
        setLoading(false);
        setMatchesLoading(false);
      }
    };

    if (schoolAccount?.has_paid && jobId) {
      fetchJob();
    }
  }, [schoolAccount, jobId]);

  const handleRunMatching = async () => {
    setRunningMatching(true);
    try {
      const result = await apiClient.runJobMatching(jobId);
      alert(result.message);

      // Refresh matches
      const matchesData = await apiClient.getJobMatches(jobId);
      setMatches(matchesData);

      // Refresh job stats
      const jobData = await apiClient.getSchoolJob(jobId);
      setJob(jobData);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to run matching');
    } finally {
      setRunningMatching(false);
    }
  };

  const handleSelectForInterview = async (teacherId: number) => {
    setSelectingId(teacherId);
    try {
      await apiClient.createInterviewSelection({
        teacher_id: teacherId,
        school_job_id: jobId,
      });

      // Update local state to show selection
      setMatches(matches.map(m => {
        if (m.teacher_id === teacherId && m.teacher) {
          return {
            ...m,
            teacher: { ...m.teacher, is_selected_for_interview: true }
          };
        }
        return m;
      }));

      // Update job selection count
      if (job) {
        setJob({ ...job, selection_count: job.selection_count + 1 });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to select teacher');
    } finally {
      setSelectingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!schoolAccount?.has_paid) {
    return null;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SchoolNavHeader />
        <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error || 'Job not found'}</p>
            <Link href="/my-jobs" className="text-brand-red hover:underline mt-2 inline-block">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/my-jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  {job.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.city}
                    </span>
                  )}
                  {job.salary_display && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.salary_display}
                    </span>
                  )}
                  {!job.is_active && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleRunMatching}
                disabled={runningMatching || !job.is_active}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {runningMatching ? 'Running...' : 'Run Matching'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Matches</p>
                  <p className="text-xl font-bold text-gray-900">{job.match_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Selections</p>
                  <p className="text-xl font-bold text-gray-900">{job.selection_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Subjects</p>
                  <p className="text-lg font-bold text-gray-900">{job.subjects?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p>
                  <p className="text-lg font-bold text-gray-900">{job.experience_required || 'Any'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.subjects && job.subjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-1">
                    {job.subjects.map(s => (
                      <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {job.age_groups && job.age_groups.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Age Groups</h3>
                  <div className="flex flex-wrap gap-1">
                    {job.age_groups.map(a => (
                      <span key={a} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm capitalize">
                        {a.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {job.description && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Matched Teachers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Matched Teachers</h2>
              <span className="text-gray-500">{matches.length} teachers</span>
            </div>

            {matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto" />
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Yet</h3>
                <p className="text-gray-600 mb-6">
                  Click &quot;Run Matching&quot; to find teachers that match this job&apos;s criteria.
                </p>
                <button
                  onClick={handleRunMatching}
                  disabled={runningMatching || !job.is_active}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  Run Matching Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => {
                  const teacher = match.teacher;
                  if (!teacher) return null;

                  const isSelected = teacher.is_selected_for_interview;

                  return (
                    <div
                      key={match.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Teacher Photo */}
                        <div className="flex-shrink-0">
                          {teacher.headshot_url ? (
                            <img
                              src={teacher.headshot_url}
                              alt={`${teacher.first_name} ${teacher.last_name}`}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Teacher Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {teacher.first_name} {teacher.last_name}
                              </h3>
                              <p className="text-gray-600 text-sm">{teacher.email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-brand-red">
                                {match.match_score}%
                              </div>
                              <p className="text-xs text-gray-500">Match Score</p>
                            </div>
                          </div>

                          {/* Match Reasons */}
                          {match.match_reasons && match.match_reasons.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {match.match_reasons.map((reason, i) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Teacher Details */}
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {teacher.preferred_location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {teacher.preferred_location}
                              </span>
                            )}
                            {teacher.years_experience && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {teacher.years_experience} years exp
                              </span>
                            )}
                            {teacher.cv_url && (
                              <a
                                href={teacher.cv_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-brand-red hover:underline"
                              >
                                <FileText className="w-4 h-4" />
                                View CV
                              </a>
                            )}
                            {teacher.video_url && (
                              <a
                                href={teacher.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-brand-red hover:underline"
                              >
                                <Video className="w-4 h-4" />
                                Watch Video
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSelectForInterview(teacher.id)}
                              disabled={selectingId === teacher.id}
                              className="px-4 py-2 border border-brand-red text-brand-red rounded-lg text-sm font-medium hover:bg-brand-red hover:text-white transition-colors disabled:opacity-50"
                            >
                              {selectingId === teacher.id ? 'Selecting...' : 'Select for Interview'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
