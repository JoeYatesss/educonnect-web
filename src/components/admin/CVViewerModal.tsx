'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/constants';

interface CVViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  teacherName: string;
  cvPath: string | null;
}

export default function CVViewerModal({
  isOpen,
  onClose,
  teacherId,
  teacherName,
  cvPath,
}: CVViewerModalProps) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cvPath) {
      fetchCVUrl();
    }
  }, [isOpen, cvPath]);

  const fetchCVUrl = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (await import('@/lib/supabase/client'))
        .createClient()
        .auth.getSession();
      const token = session?.access_token || '';

      // Get signed URL for CV (admin endpoint)
      const response = await fetch(
        `${API_URL}/api/v1/admin/teachers/${teacherId}/cv-url`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch CV URL');

      const data = await response.json();
      setCvUrl(data.cv_url);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch CV URL:', err);
      setError('Failed to load CV. Please try again.');
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client'))
        .createClient()
        .auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/admin/teachers/${teacherId}/cv-download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to download CV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${teacherName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download CV:', err);
      alert('Failed to download CV. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">CV Viewer</h3>
            <p className="text-sm text-gray-500">{teacherName}</p>
          </div>
          <div className="flex gap-3">
            {cvUrl && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download CV
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading CV</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <button
                  onClick={fetchCVUrl}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !cvPath ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No CV Uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This teacher hasn't uploaded a CV yet.
                </p>
              </div>
            </div>
          ) : cvUrl ? (
            <iframe
              src={cvUrl}
              className="w-full h-full border-0"
              title="CV Viewer"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
