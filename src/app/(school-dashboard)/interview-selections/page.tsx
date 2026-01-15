'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import { InterviewSelectionWithDetails, InterviewSelectionStatus } from '@/types';
import {
  UserCheck, Image, MapPin, FileText, Video, ChevronDown,
  Clock, CheckCircle2, XCircle, Calendar, Briefcase, Mail
} from 'lucide-react';

const STATUS_OPTIONS: { value: InterviewSelectionStatus; label: string; color: string }[] = [
  { value: 'selected_for_interview', label: 'Selected', color: 'bg-blue-100 text-blue-700' },
  { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-700' },
  { value: 'interview_completed', label: 'Interview Completed', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'offer_extended', label: 'Offer Extended', color: 'bg-amber-100 text-amber-700' },
  { value: 'offer_accepted', label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
  { value: 'offer_declined', label: 'Offer Declined', color: 'bg-red-100 text-red-700' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-700' },
];

function getStatusConfig(status: InterviewSelectionStatus) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
}

export default function InterviewSelectionsPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selections, setSelections] = useState<InterviewSelectionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InterviewSelectionStatus | ''>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

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
    const fetchSelections = async () => {
      try {
        const data = await apiClient.getInterviewSelections(
          filterStatus ? { status: filterStatus } : undefined
        );
        setSelections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load selections');
      } finally {
        setLoading(false);
      }
    };

    if (schoolAccount?.has_paid) {
      fetchSelections();
    }
  }, [schoolAccount, filterStatus]);

  const handleStatusUpdate = async (selectionId: number, newStatus: InterviewSelectionStatus) => {
    setUpdatingId(selectionId);
    setOpenDropdown(null);
    try {
      await apiClient.updateInterviewSelection(selectionId, { status: newStatus });
      setSelections(selections.map(s =>
        s.id === selectionId ? { ...s, status: newStatus, status_updated_at: new Date().toISOString() } : s
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (selectionId: number) => {
    if (!confirm('Are you sure you want to remove this selection?')) return;

    try {
      await apiClient.deleteInterviewSelection(selectionId);
      setSelections(selections.filter(s => s.id !== selectionId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove selection');
    }
  };

  // Group selections by status
  const groupedSelections = STATUS_OPTIONS.reduce((acc, { value }) => {
    acc[value] = selections.filter(s => s.status === value);
    return acc;
  }, {} as Record<InterviewSelectionStatus, InterviewSelectionWithDetails[]>);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading selections...</p>
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Selections</h1>
              <p className="text-gray-600">
                Manage teachers you&apos;ve selected for interviews
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as InterviewSelectionStatus | '')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total</p>
                  <p className="text-xl font-bold text-gray-900">{selections.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Scheduled</p>
                  <p className="text-xl font-bold text-gray-900">
                    {groupedSelections.interview_scheduled?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Offers Extended</p>
                  <p className="text-xl font-bold text-gray-900">
                    {groupedSelections.offer_extended?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Accepted</p>
                  <p className="text-xl font-bold text-gray-900">
                    {groupedSelections.offer_accepted?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Selections List */}
          {selections.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Selections Yet</h3>
              <p className="text-gray-600 mb-6">
                Select teachers for interviews from your job matches.
              </p>
              <Link
                href="/my-jobs"
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600"
              >
                View My Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {selections.map((selection) => {
                const statusConfig = getStatusConfig(selection.status);
                const teacher = selection.teacher;

                return (
                  <div
                    key={selection.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Teacher Photo */}
                      <div className="flex-shrink-0">
                        {selection.teacher_headshot_url ? (
                          <img
                            src={selection.teacher_headshot_url}
                            alt={selection.teacher_name || 'Teacher'}
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
                              {selection.teacher_name || 'Unknown Teacher'}
                            </h3>
                            {selection.teacher_email && (
                              <p className="text-gray-600 text-sm flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {selection.teacher_email}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Job Info */}
                        {selection.job_title && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Applied for: </span>
                            <span className="text-sm font-medium text-gray-900">{selection.job_title}</span>
                          </div>
                        )}

                        {/* Teacher Details */}
                        {teacher && (
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
                        )}

                        {/* Notes */}
                        {selection.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">
                            Note: {selection.notes}
                          </p>
                        )}

                        {/* Timestamp */}
                        <p className="mt-2 text-xs text-gray-400">
                          Selected {new Date(selection.selected_at).toLocaleDateString()}
                          {selection.status_updated_at !== selection.selected_at && (
                            <> • Updated {new Date(selection.status_updated_at).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-start gap-2">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === selection.id ? null : selection.id)}
                            disabled={updatingId === selection.id}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            {updatingId === selection.id ? 'Updating...' : 'Update Status'}
                            <ChevronDown className="w-4 h-4" />
                          </button>

                          {openDropdown === selection.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {STATUS_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  onClick={() => handleStatusUpdate(selection.id, opt.value)}
                                  disabled={opt.value === selection.status}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                    opt.value === selection.status ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                                  }`}
                                >
                                  <span className={`w-3 h-3 rounded-full ${opt.color.split(' ')[0]}`} />
                                  {opt.label}
                                  {opt.value === selection.status && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemove(selection.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Remove selection"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
