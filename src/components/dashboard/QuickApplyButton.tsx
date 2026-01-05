'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { Check, Loader2, Send, Lock } from 'lucide-react';
import Modal from '@/components/modals/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface QuickApplyButtonProps {
  matchId: number;
  matchCity: string;
  matchProvince: string;
  isAlreadyApplied?: boolean;
  onSuccess?: () => void;
}

export default function QuickApplyButton({
  matchId,
  matchCity,
  matchProvince,
  isAlreadyApplied = false,
  onSuccess
}: QuickApplyButtonProps) {
  const { teacher } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(isAlreadyApplied);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when prop changes (e.g., after data refresh)
  useEffect(() => {
    setIsApplied(isAlreadyApplied);
  }, [isAlreadyApplied]);

  const handleApply = async () => {
    setIsApplying(true);
    setError(null);

    try {
      await apiClient.applyToMatch(matchId);
      setIsApplied(true);
      setShowConfirm(false);
      onSuccess?.();
      // State stays applied permanently now
    } catch (err: any) {
      console.error('Failed to apply:', err);
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  // If user hasn't paid, show locked button
  if (!teacher?.has_paid) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60"
        title="Payment required to apply"
      >
        <Lock className="w-4 h-4" />
        <span className="hidden sm:inline">Unlock to Apply</span>
      </button>
    );
  }

  // If already applied, show applied state
  if (isApplied) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-default"
      >
        <Check className="w-4 h-4" />
        <span className="hidden sm:inline">Applied</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isApplying}
        className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isApplying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Applying...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Apply</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} maxWidth="md">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Apply to this School?
          </h3>
          <p className="text-gray-600 mb-2">
            You're about to apply to a school in{' '}
            <strong className="text-gray-900">
              {matchCity}, {matchProvince}
            </strong>
            .
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Our team will submit your application on your behalf and notify you of any updates.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={isApplying}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Confirm Application'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
