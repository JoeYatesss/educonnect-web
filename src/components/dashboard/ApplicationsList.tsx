'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { FileText, Calendar, MapPin, Check, Clock, Briefcase, Building2, Languages, Award, Gift, BookOpen, Users, Sparkles, Home, Plane } from 'lucide-react';

interface Application {
  id: number;
  city: string;
  province: string;
  location_chinese?: string;
  school_type: string;
  salary_range: string;
  status: 'pending' | 'document_verification' | 'school_matching' |
          'interview_scheduled' | 'interview_completed' | 'offer_extended' |
          'placed' | 'declined';
  submitted_at: string;
  updated_at: string;
  role_name?: string;
  expiry_date?: string;
  is_job_application?: boolean;
  job_description?: string;
  external_url?: string;
  company?: string;
  // Job-specific fields
  age_groups?: string[];
  subjects?: string[];
  chinese_required?: boolean;
  qualification?: string;
  contract_type?: string;
  job_functions?: string;
  requirements?: string;
  benefits?: string;
  is_new?: boolean;
  contract_term?: string;
  job_type?: string;
  start_date?: string;
  apply_by?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  about_school?: string;
  school_address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  visa_sponsorship?: boolean;
  accommodation_provided?: string;
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

  // Decode HTML entities like &nbsp; &amp; etc.
  const decodeHtmlEntities = (text: string | undefined | null): string => {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Format job description for better readability
  const formatJobDescription = (text: string | undefined | null): string => {
    if (!text) return '';

    // First decode HTML entities
    let formatted = decodeHtmlEntities(text);

    // Replace multiple &nbsp; or spaces with a single space first
    formatted = formatted.replace(/\s+/g, ' ');

    // Add line breaks before common section headers
    const sectionHeaders = [
      'The Role',
      'Key Responsibilities:',
      'Responsibilities:',
      'Duties:',
      'Requirements:',
      'Qualifications:',
      'About Role',
      'About the Role',
      'Job Summary',
      'About Us',
      'Benefits:',
      'What we offer:',
    ];

    sectionHeaders.forEach(header => {
      const regex = new RegExp(`\\s*(${header})`, 'gi');
      formatted = formatted.replace(regex, '\n\n$1');
    });

    // Add line breaks before bullet points (•, -, *)
    formatted = formatted.replace(/\s*([•\-\*])\s+/g, '\n$1 ');

    // Add line breaks before numbered items (1., 2., etc.)
    formatted = formatted.replace(/\s+(\d+\.)\s+/g, '\n$1 ');

    // Add line breaks before capital letter sentences that follow a period
    formatted = formatted.replace(/\.\s+([A-Z])/g, '.\n$1');

    // Clean up multiple newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // Trim whitespace
    formatted = formatted.trim();

    return formatted;
  };

  const isExpiringSoon = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
                    {application.role_name && (
                      <div className="flex items-center gap-1 mb-1">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span className="text-base font-semibold text-gray-900">{decodeHtmlEntities(application.role_name)}</span>
                      </div>
                    )}
                    <h3 className={`${application.role_name ? 'text-sm text-gray-600' : 'text-lg font-medium text-gray-900'}`}>
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
                      {application.expiry_date && (
                        <span className={`inline-flex items-center gap-1 text-xs ${
                          isExpired(application.expiry_date)
                            ? 'text-red-600 font-medium'
                            : isExpiringSoon(application.expiry_date)
                              ? 'text-amber-600 font-medium'
                              : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {isExpired(application.expiry_date)
                            ? 'Expired'
                            : `Expires ${formatDate(application.expiry_date)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Info Badges (for job applications) */}
              {application.is_job_application && (
                <div className="mt-3 px-2 flex flex-wrap gap-2">
                  {/* New Badge */}
                  {application.is_new && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-100 text-rose-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </span>
                  )}
                  {/* Company */}
                  {application.company && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      <Building2 className="w-3 h-3 mr-1" />
                      {decodeHtmlEntities(application.company)}
                    </span>
                  )}
                  {application.job_type && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-violet-100 text-violet-800">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {application.job_type}
                    </span>
                  )}
                  {/* Contract Type - only show if different from job_type */}
                  {application.contract_type && application.contract_type !== application.job_type && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                      <FileText className="w-3 h-3 mr-1" />
                      {application.contract_type}
                    </span>
                  )}
                  {application.start_date && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-100 text-cyan-800">
                      <Calendar className="w-3 h-3 mr-1" />
                      Starts: {application.start_date}
                    </span>
                  )}
                  {application.apply_by && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Apply by: {application.apply_by}
                    </span>
                  )}
                  {/* Chinese Required */}
                  {application.chinese_required !== undefined && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      application.chinese_required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Languages className="w-3 h-3 mr-1" />
                      {application.chinese_required ? 'Chinese Required' : 'No Chinese'}
                    </span>
                  )}
                  {/* Visa Sponsorship */}
                  {application.visa_sponsorship && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Plane className="w-3 h-3 mr-1" />
                      Visa Sponsored
                    </span>
                  )}
                  {/* Accommodation */}
                  {application.accommodation_provided && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-100 text-teal-800">
                      <Home className="w-3 h-3 mr-1" />
                      {application.accommodation_provided}
                    </span>
                  )}
                </div>
              )}

              {/* Subjects and Age Groups (for job applications) */}
              {application.is_job_application && (application.subjects?.length || application.age_groups?.length) && (
                <div className="mt-2 px-2 flex flex-wrap gap-2">
                  {application.age_groups?.map((age, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      <Users className="w-3 h-3 mr-1" />
                      {age}
                    </span>
                  ))}
                  {application.subjects?.slice(0, 3).map((subject, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subject}
                    </span>
                  ))}
                  {application.subjects && application.subjects.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600">
                      +{application.subjects.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* NOTE: Job description, recruiter contact, and external link are only shown in admin dashboard */}

              {/* About the School (for job applications) */}
              {application.is_job_application && application.about_school && (
                <div className="mt-3 px-2">
                  <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    About the School:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-4 whitespace-pre-line leading-relaxed">
                    {formatJobDescription(application.about_school)}
                  </p>
                  {application.school_address && (
                    <p className="mt-1 text-xs text-gray-500">
                      Address: {[
                        application.school_address.street,
                        application.school_address.city,
                        application.school_address.state,
                        application.school_address.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Qualification (for job applications) */}
              {application.is_job_application && application.qualification && (
                <div className="mt-3 px-2">
                  <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    Qualifications Required:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {formatJobDescription(application.qualification)}
                  </p>
                </div>
              )}

              {/* Requirements (for job applications) */}
              {application.is_job_application && application.requirements && (
                <div className="mt-3 px-2">
                  <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-600" />
                    Requirements:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {formatJobDescription(application.requirements)}
                  </p>
                </div>
              )}

              {/* Benefits (for job applications) */}
              {application.is_job_application && application.benefits && (
                <div className="mt-3 px-2">
                  <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-green-600" />
                    Benefits:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {formatJobDescription(application.benefits)}
                  </p>
                </div>
              )}

              {/* NOTE: External job link is only shown in admin dashboard */}

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
