'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { FileText, Calendar, MapPin, Check } from 'lucide-react';

interface Application {
  id: number;
  city: string;
  province: string;
  school_type: string;
  salary_range: string;
  status: 'pending' | 'document_verification' | 'school_matching' |
          'interview_scheduled' | 'interview_completed' | 'offer_extended' |
          'placed' | 'declined';
  submitted_at: string;
  updated_at: string;
}

// Progress stages for each application
const PROGRESS_STAGES = [
  { key: 'pending', label: 'Applied' },
  { key: 'document_verification', label: 'Verification' },
  { key: 'interview_scheduled', label: 'Interview' },
  { key: 'offer_extended', label: 'Offer' },
  { key: 'placed', label: 'Placed' },
];

export default function ApplicationsList() {
  const { teacher } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [teacher]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyApplications();
      setApplications(data as Application[] || []);
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications</h2>
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Start by viewing your school matches. Our team will submit applications on your behalf after reviewing your profile.
          </p>
        </div>
      </div>
    );
  }

  // Get progress index for a status
  const getProgressIndex = (status: Application['status']) => {
    if (status === 'declined') return -1;
    if (status === 'school_matching') return 2; // Map to Interview stage
    if (status === 'interview_completed') return 2; // Same as interview_scheduled visually
    return PROGRESS_STAGES.findIndex(s => s.key === status);
  };

  // Applications list
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Applications
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </span>
      </div>

      <div className="space-y-6">
        {applications.map((application) => {
          const currentIndex = getProgressIndex(application.status);
          const isDeclined = application.status === 'declined';

          return (
            <div
              key={application.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-brand-red/50 hover:shadow-md transition-all"
            >
              {/* Application Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {(() => {
                        const city = application.city?.trim();
                        const province = application.province?.trim();
                        const normalizedCity = city?.toLowerCase();
                        const normalizedProvince = province?.toLowerCase();
                        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                        const displayCity = city ? capitalize(city) : '';
                        if (!province || normalizedCity === normalizedProvince) {
                          return `${displayCity}, China`;
                        }
                        return `${displayCity}, ${capitalize(province)}`;
                      })()}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {application.school_type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        {application.salary_range}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(application.submitted_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              {isDeclined ? (
                <div className="bg-red-50 rounded-lg p-3 mt-2">
                  <p className="text-sm text-red-700">
                    This application was not successful. We're still working on finding the perfect match for you.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    {PROGRESS_STAGES.map((stage, index) => {
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const isPending = index > currentIndex;

                      return (
                        <div key={stage.key} className="flex-1 flex flex-col items-center relative">
                          {/* Connector line */}
                          {index > 0 && (
                            <div
                              className={`absolute top-3 right-1/2 w-full h-0.5 -z-10 ${
                                index <= currentIndex ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                            />
                          )}

                          {/* Step circle */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              isCompleted
                                ? 'bg-blue-500 text-white'
                                : isCurrent
                                ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>

                          {/* Label */}
                          <span
                            className={`mt-1.5 text-xs text-center ${
                              isCurrent ? 'font-medium text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {applications.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> School names are confidential for your privacy. Our team manages all applications and will keep you updated on their progress.
          </p>
        </div>
      )}
    </div>
  );
}
