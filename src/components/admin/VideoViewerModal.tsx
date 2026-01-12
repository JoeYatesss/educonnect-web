'use client';

import { useState } from 'react';

interface VideoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  videoUrl: string | null | undefined;
}

export default function VideoViewerModal({
  isOpen,
  onClose,
  teacherName,
  videoUrl,
}: VideoViewerModalProps) {
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Failed to download video');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${teacherName.replace(/\s+/g, '_')}_Intro_Video.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download video:', err);
      alert('Failed to download video. Please try again.');
    }
  };

  const handleVideoError = () => {
    setError(true);
  };

  const handleRetry = () => {
    setError(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Intro Video</h3>
            <p className="text-sm text-gray-500">{teacherName}</p>
          </div>
          <div className="flex gap-3">
            {videoUrl && (
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
                Download
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

        {/* Video Player */}
        <div className="flex-1 overflow-hidden p-4 bg-gray-900 flex items-center justify-center min-h-[400px]">
          {!videoUrl ? (
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-200">No Video Uploaded</h3>
              <p className="mt-1 text-sm text-gray-400">
                This teacher hasn't uploaded an intro video yet.
              </p>
            </div>
          ) : error ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-200">Error Loading Video</h3>
              <p className="mt-1 text-sm text-gray-400">
                Failed to load the video. Please try again.
              </p>
              <button
                onClick={handleRetry}
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Retry
              </button>
            </div>
          ) : (
            <video
              key={videoUrl}
              controls
              autoPlay={false}
              className="max-w-full max-h-full rounded"
              onError={handleVideoError}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
