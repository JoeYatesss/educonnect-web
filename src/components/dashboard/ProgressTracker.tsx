'use client';

import { ApplicationStatus } from '@/types';

interface ProgressTrackerProps {
  currentStatus: ApplicationStatus;
}

const stages = [
  { key: 'pending', label: 'Pending', description: 'Application received' },
  { key: 'document_verification', label: 'Verification', description: 'Documents being verified' },
  { key: 'school_matching', label: 'Matching', description: 'Finding best schools' },
  { key: 'interview_scheduled', label: 'Interview', description: 'Interview scheduled' },
  { key: 'interview_completed', label: 'Completed', description: 'Interview done' },
  { key: 'offer_extended', label: 'Offer', description: 'Offer received' },
  { key: 'placed', label: 'Placed', description: 'Successfully placed!' },
];

export default function ProgressTracker({ currentStatus }: ProgressTrackerProps) {
  const currentIndex = stages.findIndex((stage) => stage.key === currentStatus);
  const isDeclined = currentStatus === 'declined';

  if (isDeclined) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status</h2>
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Application Declined</h3>
              <p className="mt-2 text-sm text-yellow-700">
                This application was not successful. Don't worry - we're still working on finding
                the perfect match for you!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Progress</h2>

      <div className="relative">
        {/* Progress bar */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200">
          <div
            className="bg-blue-600 w-full transition-all duration-500"
            style={{
              height: `${(currentIndex / (stages.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stages */}
        <div className="space-y-8">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={stage.key} className="relative flex items-start">
                {/* Icon */}
                <div className="relative z-10">
                  {isCompleted && (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </div>
                  )}
                  {isPending && (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">{stage.label}</div>
                  <div className="mt-1 text-sm text-gray-500">{stage.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
