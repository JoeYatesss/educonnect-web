'use client';

import { useEffect } from 'react';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileType: 'cv' | 'video' | 'photo';
  fileName: string;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileType,
  fileName,
}: FilePreviewModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {fileType === 'cv' ? 'CV/Resume' : fileType === 'video' ? 'Intro Video' : 'Headshot Photo'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {fileType === 'cv' ? (
              // PDF viewer - use iframe for better compatibility
              <div className="bg-white rounded-lg shadow-inner h-full min-h-[600px]">
                <iframe
                  src={fileUrl}
                  className="w-full h-full min-h-[600px] rounded-lg"
                  title="CV Preview"
                />
              </div>
            ) : fileType === 'video' ? (
              // Video player
              <div className="flex items-center justify-center bg-black rounded-lg">
                <video
                  src={fileUrl}
                  controls
                  className="max-w-full max-h-[70vh] rounded-lg"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              // Image viewer
              <div className="flex items-center justify-center">
                <img
                  src={fileUrl}
                  alt="Headshot"
                  className="max-w-full max-h-[70vh] rounded-lg shadow-lg object-contain"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl flex items-center justify-between">
            <p className="text-sm text-gray-500 truncate max-w-md">{fileName}</p>
            <div className="flex gap-3">
              <a
                href={fileUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
