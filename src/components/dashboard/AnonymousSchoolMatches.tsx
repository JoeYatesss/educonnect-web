'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import PaymentModal from './PaymentModal';
import { SchoolMatch } from './MatchCard';
import QuickApplyButton from './QuickApplyButton';
import Link from 'next/link';
import { MapPin, DollarSign, ArrowRight, Briefcase, Clock, Sparkles, Languages, BookOpen } from 'lucide-react';

// Decode HTML entities like &nbsp; &amp; etc.
const decodeHtmlEntities = (text: string | undefined | null): string => {
  if (!text || typeof window === 'undefined') return text || '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export default function AnonymousSchoolMatches() {
  const { teacher } = useAuth();
  const [matches, setMatches] = useState<SchoolMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [teacher]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      if (teacher?.has_paid) {
        // Fetch full matches for paid users
        const data = await apiClient.getMyMatches();
        setMatches(data as SchoolMatch[] || []);
      } else {
        // Fetch preview matches for unpaid users
        const data = await apiClient.getPreviewMatches();
        setMatches(data as SchoolMatch[] || []);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
      console.error('Failed to fetch matches:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get score color based on match percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 65) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  // Sort matches by score descending
  const sortedMatches = [...matches].sort((a, b) => b.match_score - a.match_score);

  // UNPAID USER VIEW with preview
  if (!teacher?.has_paid) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">School Matches</h2>

          {/* Preview Cards with Blur */}
          <div className="space-y-4 relative">
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2 Matches Found!</h3>
                <p className="text-gray-600 mb-6">Complete payment to view school details and apply</p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Unlock Matches
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Blurred preview cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 opacity-40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">••••••, ••••••</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {85 + i * 3}% match
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">•••••••••</span>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">•••••••</span>
                </div>
                <div className="text-sm text-gray-500">••••••••••••••</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal - positioned outside container for full-page overlay */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            window.location.reload();
          }}
        />
      </>
    );
  }

  // PAID USER VIEW
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Finding Your Perfect Matches</p>
          <p className="mt-2 text-sm text-gray-500">
            Our team is reviewing your profile and matching you with schools. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Simplified paid user view - just location, salary, score, and quick apply
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with link to full matches page */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">School Matches</h2>
          <p className="text-sm text-gray-500">{matches.length} matches found</p>
        </div>
        <Link
          href="/matches"
          className="inline-flex items-center gap-1 text-sm text-brand-red hover:text-red-600 font-medium"
        >
          View All Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Simplified match list */}
      <div className="space-y-3">
        {sortedMatches.slice(0, 5).map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            {/* Left: Role, Location, Salary, and Expiry */}
            <div className="flex-1 min-w-0">
              {/* Role name with optional new badge */}
              {match.role_name && (
                <div className="flex items-center gap-2 text-gray-900 mb-1">
                  <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-semibold truncate">{decodeHtmlEntities(match.role_name)}</span>
                  {match.is_new && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      New
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-900">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={`${match.role_name ? 'text-sm text-gray-600' : 'font-medium'} truncate`}>
                  {(() => {
                    const city = match.city?.trim();
                    const province = match.province?.trim();
                    const normalizedCity = city?.toLowerCase();
                    const normalizedProvince = province?.toLowerCase();
                    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                    const displayCity = city ? capitalize(city) : '';
                    if (!province || normalizedCity === normalizedProvince) {
                      return `${displayCity}, China`;
                    }
                    return `${displayCity}, ${capitalize(province)}`;
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{match.salary_range || 'Salary TBD'}</span>
              </div>
              {/* Subjects preview */}
              {match.subjects && match.subjects.length > 0 && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {match.subjects.slice(0, 2).join(', ')}
                    {match.subjects.length > 2 && ` +${match.subjects.length - 2} more`}
                  </span>
                </div>
              )}
              {/* Chinese requirement indicator */}
              {match.chinese_required !== undefined && (
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Languages className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className={match.chinese_required ? 'text-red-600' : 'text-gray-500'}>
                    {match.chinese_required ? 'Chinese Required' : 'No Chinese'}
                  </span>
                </div>
              )}
              {/* Show expiry date for submitted applications, or application_deadline for job matches */}
              {(match.expiry_date || match.application_deadline) && (
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {(() => {
                    // Use expiry_date for submitted apps, application_deadline for job matches
                    const dateStr = match.expiry_date || match.application_deadline;
                    const expiry = new Date(dateStr!);
                    const now = new Date();
                    const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpired = daysUntil <= 0;
                    const isExpiringSoon = daysUntil > 0 && daysUntil <= 7;
                    const label = match.is_submitted ? 'Expires' : 'Deadline';
                    return (
                      <span className={`truncate ${
                        isExpired ? 'text-red-600 font-medium' :
                        isExpiringSoon ? 'text-amber-600 font-medium' :
                        'text-gray-600'
                      }`}>
                        {isExpired
                          ? (match.is_submitted ? 'Expired' : 'Deadline passed')
                          : `${label}: ${expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        }
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Center: Match Score */}
            <div className="px-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(match.match_score)}`}>
                {match.match_score.toFixed(0)}% match
              </span>
            </div>

            {/* Right: Apply Button */}
            <div className="flex-shrink-0">
              <QuickApplyButton
                matchId={match.id}
                matchCity={match.city}
                matchProvince={match.province}
                isAlreadyApplied={match.is_submitted}
                onSuccess={() => fetchMatches()}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Show more link if there are more matches */}
      {matches.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href="/matches"
            className="inline-flex items-center gap-1 text-sm text-brand-red hover:text-red-600 font-medium"
          >
            View all {matches.length} matches
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-4 bg-blue-50 rounded-lg border border-blue-200 p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> School names are confidential. View the matches page for full details and filters.
        </p>
      </div>
    </div>
  );
}
