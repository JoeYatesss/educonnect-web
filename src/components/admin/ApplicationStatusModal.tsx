'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/constants';

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    id: number;
    school_name: string;
    status: string;
  };
  onUpdate: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'document_verification', label: 'Document Verification' },
  { value: 'school_matching', label: 'School Matching' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'offer_extended', label: 'Offer Extended' },
  { value: 'placed', label: 'Placed' },
  { value: 'declined', label: 'Declined' },
];

export default function ApplicationStatusModal({
  isOpen,
  onClose,
  application,
  onUpdate,
}: ApplicationStatusModalProps) {
  const [newStatus, setNewStatus] = useState(application.status);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await (await import('@/lib/supabase/client'))
        .createClient()
        .auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/applications/${application.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      alert('Status updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Update Status</h3>
        <p className="text-sm text-gray-600 mb-4">{application.school_name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              required
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading || newStatus === application.status}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
