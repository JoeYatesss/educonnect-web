'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { AdminInterviewSelection } from '@/types';
import { UserCheck, Building2, RefreshCw, ExternalLink } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  selected_for_interview: 'bg-blue-100 text-blue-700',
  interview_scheduled: 'bg-purple-100 text-purple-700',
  interview_completed: 'bg-indigo-100 text-indigo-700',
  offer_extended: 'bg-amber-100 text-amber-700',
  offer_accepted: 'bg-green-100 text-green-700',
  offer_declined: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  selected_for_interview: 'Selected',
  interview_scheduled: 'Scheduled',
  interview_completed: 'Completed',
  offer_extended: 'Offer Extended',
  offer_accepted: 'Accepted',
  offer_declined: 'Declined',
  withdrawn: 'Withdrawn',
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function InterviewSelectionsPanel() {
  const [selections, setSelections] = useState<AdminInterviewSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSelections = useCallback(async () => {
    try {
      const data = await apiClient.getAdminRecentInterviewSelections();
      setSelections(data.selections);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch interview selections:', err);
      setError('Failed to load selections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  const handleRefresh = () => {
    setLoading(true);
    fetchSelections();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-medium text-gray-900">Interview Selections</h2>
          {selections.length > 0 && (
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {selections.length} recent
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {formatRelativeTime(lastUpdated.toISOString())}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && selections.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      ) : selections.length === 0 ? (
        <div className="text-center py-8">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No recent interview selections</p>
          <p className="text-xs text-gray-400 mt-1">Selections from the last 24 hours will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {selections.map((selection) => (
            <div
              key={selection.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Teacher Avatar */}
                <div className="flex-shrink-0">
                  {selection.teacher_headshot_url ? (
                    <img
                      src={selection.teacher_headshot_url}
                      alt={selection.teacher_name || 'Teacher'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">
                        {selection.teacher_name?.split(' ').map(n => n[0]).join('') || 'T'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selection.teacher_name || 'Unknown Teacher'}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selection.status] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[selection.status] || selection.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">
                      {selection.school_name || 'Unknown School'}
                      {selection.job_title && (
                        <span className="text-gray-400"> • {selection.job_title}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(selection.selected_at)}
                </span>
                {selection.teacher_id && (
                  <Link
                    href={`/admin/teachers/${selection.teacher_id}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    title="View Teacher"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Click refresh to update
        </p>
      </div>
    </div>
  );
}
