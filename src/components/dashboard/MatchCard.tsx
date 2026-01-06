'use client';

import { useState } from 'react';
import {
  MapPin,
  GraduationCap,
  Users,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Calendar,
  Home,
  Plane,
  Briefcase,
  Building2,
  Languages,
  FileText,
  Award,
  Gift,
  Sparkles,
  BookOpen
} from 'lucide-react';

export interface SchoolMatch {
  id: number;
  city: string;
  province: string;
  location_chinese?: string;
  school_type: string;
  age_groups: string[];
  subjects?: string[];
  salary_range: string;
  match_score: number;
  match_reasons: string[];
  is_submitted?: boolean;
  role_name?: string;
  expiry_date?: string;  // Application expiry date
  // Job-specific fields (for TES jobs)
  type?: 'school' | 'job';
  source?: string;
  title?: string;
  company?: string;
  job_id?: number;
  school_id?: number;
  application_deadline?: string;
  start_date?: string;
  visa_sponsorship?: boolean;
  accommodation_provided?: string;
  external_url?: string;
  description?: string;
  // Structured fields from job detail pages
  job_type?: string;
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
  // Additional job fields
  chinese_required?: boolean;
  qualification?: string;
  contract_type?: string;
  contract_term?: string;
  job_functions?: string;
  requirements?: string;
  benefits?: string;
  is_new?: boolean;
}

interface MatchCardProps {
  match: SchoolMatch;
  children?: React.ReactNode; // For QuickApplyButton or other actions
}

interface ScoreComponent {
  label: string;
  score: number;
  weight: number;
  icon: typeof MapPin;
  color: string;
  bgColor: string;
}

// Helper to calculate days until deadline
const getDaysUntilDeadline = (deadline: string): number | null => {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper to format deadline display
const formatDeadline = (deadline: string): string => {
  const date = new Date(deadline);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Decode HTML entities like &nbsp; &amp; etc.
const decodeHtmlEntities = (text: string | undefined | null): string => {
  if (!text || typeof window === 'undefined') return text || '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Format job description for better readability
const formatJobDescription = (text: string | undefined | null): string => {
  if (!text) return '';

  // First decode HTML entities
  let formatted = decodeHtmlEntities(text);

  // Replace multiple spaces with single space
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
    'About the School',
    'The School',
    'The Position',
    'Position Summary',
    'Essential Duties',
    'Primary Responsibilities',
  ];

  sectionHeaders.forEach(header => {
    const regex = new RegExp(`\\s*(${header})`, 'gi');
    formatted = formatted.replace(regex, '\n\n$1');
  });

  // Add line breaks before bullet points (•, -, *)
  formatted = formatted.replace(/\s*([•\-\*])\s+/g, '\n$1 ');

  // Add line breaks before numbered items (1., 2., A., B., etc.)
  formatted = formatted.replace(/\s+(\d+\.)\s+/g, '\n$1 ');
  formatted = formatted.replace(/\s+([A-Z]\.)\s+/g, '\n$1 ');

  // Clean up multiple newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  formatted = formatted.trim();

  return formatted;
};

export default function MatchCard({ match, children }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this is an external job (TES)
  const isExternalJob = match.source && match.source !== 'manual';
  const daysUntilDeadline = match.application_deadline ? getDaysUntilDeadline(match.application_deadline) : null;

  // Get gradient colors based on match score
  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-cyan-600';
    if (score >= 70) return 'from-amber-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  // Estimate score breakdown based on match reasons
  const estimateScoreBreakdown = (): ScoreComponent[] => {
    const reasons = match.match_reasons.map(r => r.toLowerCase());

    // Estimate individual component scores based on presence in match reasons
    const hasLocation = reasons.some(r => r.includes('location') || r.includes('city') || r.includes('province'));
    const hasSubject = reasons.some(r => r.includes('subject') || r.includes('specialty'));
    const hasAgeGroup = reasons.some(r => r.includes('age') || r.includes('grade'));
    const hasExperience = reasons.some(r => r.includes('experience') || r.includes('year'));
    const hasChinese = reasons.some(r => r.includes('chinese') || r.includes('language'));

    return [
      {
        label: 'Location Match',
        score: hasLocation ? 100 : 50,
        weight: 0.35,
        icon: MapPin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500'
      },
      {
        label: 'Subject Match',
        score: hasSubject ? 90 : 70,
        weight: 0.25,
        icon: GraduationCap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500'
      },
      {
        label: 'Age Group Match',
        score: hasAgeGroup ? 100 : 75,
        weight: 0.20,
        icon: Users,
        color: 'text-green-600',
        bgColor: 'bg-green-500'
      },
      {
        label: 'Experience Match',
        score: hasExperience ? 85 : 65,
        weight: 0.15,
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-500'
      },
      {
        label: 'Chinese Language',
        score: hasChinese ? 100 : 90,
        weight: 0.05,
        icon: MessageSquare,
        color: 'text-red-600',
        bgColor: 'bg-red-500'
      }
    ];
  };

  const scoreBreakdown = estimateScoreBreakdown();

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Header with Score, Source Badge, and Action Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${getScoreGradient(match.match_score)} text-white font-bold text-lg shadow-md`}>
            {match.match_score}% Match
          </div>
        </div>

        {/* Action button slot (QuickApplyButton will go here) */}
        <div className="ml-2">
          {children}
        </div>
      </div>

      {/* Job Title (for external jobs) */}
      {match.title && (
        <div className="mb-2">
          <span className="text-lg font-bold text-gray-900">{decodeHtmlEntities(match.title)}</span>
        </div>
      )}

      {/* Company/School Name (for external jobs) */}
      {match.company && (
        <div className="mb-2">
          <span className="text-base font-medium text-gray-700">{decodeHtmlEntities(match.company)}</span>
        </div>
      )}

      {/* Role Name (for school matches) */}
      {!match.title && match.role_name && (
        <div className="mb-3">
          <span className="text-lg font-semibold text-gray-900">{decodeHtmlEntities(match.role_name)}</span>
        </div>
      )}

      {/* Expiry Date (for submitted applications) */}
      {match.is_submitted && match.expiry_date && (
        <div className="mb-3">
          {(() => {
            const daysUntil = getDaysUntilDeadline(match.expiry_date);
            const isExpired = daysUntil !== null && daysUntil <= 0;
            const isExpiringSoon = daysUntil !== null && daysUntil > 0 && daysUntil <= 7;
            return (
              <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                isExpired
                  ? 'bg-red-100 text-red-800'
                  : isExpiringSoon
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="w-4 h-4 mr-1" />
                {isExpired
                  ? 'Application Expired'
                  : `Expires: ${formatDeadline(match.expiry_date)}`
                }
              </span>
            );
          })()}
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className={`${match.role_name ? 'text-base' : 'text-xl'} font-semibold text-gray-900`}>
          {(() => {
            const city = match.city?.trim();
            const province = match.province?.trim();
            const normalizedCity = city?.toLowerCase();
            const normalizedProvince = province?.toLowerCase();
            // Capitalize first letter
            const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            const displayCity = city ? capitalize(city) : '';
            // Only show province/country if different from city
            if (!province || normalizedCity === normalizedProvince) {
              return `${displayCity}, China`;
            }
            return `${displayCity}, ${capitalize(province)}`;
          })()}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* New Job Badge */}
        {match.is_new && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-rose-100 text-rose-800">
            <Sparkles className="w-4 h-4 mr-1" />
            New
          </span>
        )}
        {match.school_type && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
            <Building2 className="w-4 h-4 mr-1" />
            {match.school_type}
          </span>
        )}
        {match.age_groups?.map((age, idx) => (
          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            <Users className="w-4 h-4 mr-1" />
            {age}
          </span>
        ))}
        {match.subjects?.slice(0, 3).map((subject, idx) => (
          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
            <BookOpen className="w-4 h-4 mr-1" />
            {subject}
          </span>
        ))}
        {match.subjects && match.subjects.length > 3 && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-600">
            +{match.subjects.length - 3} more
          </span>
        )}
        {match.salary_range && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
            💰 {match.salary_range}
          </span>
        )}
        {/* Chinese Required */}
        {match.chinese_required !== undefined && (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            match.chinese_required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <Languages className="w-4 h-4 mr-1" />
            {match.chinese_required ? 'Chinese Required' : 'No Chinese'}
          </span>
        )}
        {/* Contract Type - only show if different from job_type */}
        {match.contract_type && match.contract_type !== match.job_type && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800">
            <FileText className="w-4 h-4 mr-1" />
            {match.contract_type}
          </span>
        )}
      </div>

      {/* External Job Info (TES-specific) */}
      {isExternalJob && (
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Job Type */}
          {match.job_type && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-violet-100 text-violet-800">
              <Briefcase className="w-4 h-4 mr-1" />
              {match.job_type}
            </span>
          )}

          {/* Application Deadline / Apply By */}
          {(match.apply_by || (match.application_deadline && daysUntilDeadline !== null)) && (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
              daysUntilDeadline !== null && daysUntilDeadline <= 7
                ? 'bg-red-100 text-red-800'
                : daysUntilDeadline !== null && daysUntilDeadline <= 14
                ? 'bg-orange-100 text-orange-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              <Clock className="w-4 h-4 mr-1" />
              {match.apply_by
                ? `Apply by: ${match.apply_by}`
                : daysUntilDeadline !== null && daysUntilDeadline <= 0
                ? 'Deadline passed'
                : daysUntilDeadline === 1
                ? '1 day left'
                : `${daysUntilDeadline} days left`
              }
              {match.application_deadline && !match.apply_by && (
                <span className="ml-1 text-xs opacity-75">({formatDeadline(match.application_deadline)})</span>
              )}
            </span>
          )}

          {/* Start Date */}
          {match.start_date && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-100 text-cyan-800">
              <Calendar className="w-4 h-4 mr-1" />
              Starts: {match.start_date}
            </span>
          )}

          {/* Visa Sponsorship */}
          {match.visa_sponsorship && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
              <Plane className="w-4 h-4 mr-1" />
              Visa Sponsored
            </span>
          )}

          {/* Accommodation */}
          {match.accommodation_provided && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-teal-100 text-teal-800">
              <Home className="w-4 h-4 mr-1" />
              {match.accommodation_provided}
            </span>
          )}
        </div>
      )}

      {/* Job Description (for external jobs) */}
      {isExternalJob && match.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2">Job Description:</p>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.description)}
            </p>
          </div>
        </div>
      )}

      {/* Qualification (for external jobs) */}
      {isExternalJob && match.qualification && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Qualifications Required:
          </p>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.qualification)}
            </p>
          </div>
        </div>
      )}

      {/* Requirements (for external jobs) */}
      {isExternalJob && match.requirements && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Requirements:
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.requirements)}
            </p>
          </div>
        </div>
      )}

      {/* Job Functions (for external jobs) */}
      {isExternalJob && match.job_functions && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Job Functions:
          </p>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.job_functions)}
            </p>
          </div>
        </div>
      )}

      {/* Benefits (for external jobs) */}
      {isExternalJob && match.benefits && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-600" />
            Benefits:
          </p>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.benefits)}
            </p>
          </div>
        </div>
      )}

      {/* NOTE: Recruiter contact and external links are only shown in admin dashboard */}

      {/* About the School (for external jobs) */}
      {isExternalJob && match.about_school && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            About the School:
          </p>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {formatJobDescription(match.about_school)}
            </p>
            {match.school_address && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-500 font-medium mb-1">School Address:</p>
                <p className="text-sm text-gray-700">
                  {[
                    match.school_address.street,
                    match.school_address.city,
                    match.school_address.state,
                    match.school_address.country,
                    match.school_address.postal_code
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Reasons */}
      {match.match_reasons && match.match_reasons.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Why this is a great match:
          </p>
          <ul className="space-y-2">
            {match.match_reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* Expandable Details Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-brand-red hover:text-red-600 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Match Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show Match Details
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            <h4 className="font-semibold text-gray-900 text-sm">Match Score Breakdown</h4>

            {scoreBreakdown.map((component, idx) => {
              const Icon = component.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${component.color}`} />
                      <span className="text-sm text-gray-700">{component.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{component.score}%</span>
                      <span className="text-xs text-gray-500">({Math.round(component.weight * 100)}% weight)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 ${component.bgColor} rounded-full transition-all duration-500`}
                      style={{ width: `${component.score}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Score breakdown is estimated based on your profile and this school's requirements.
                Actual weights: Location (35%), Subject (25%), Age Group (20%), Experience (15%), Chinese Language (5%).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
