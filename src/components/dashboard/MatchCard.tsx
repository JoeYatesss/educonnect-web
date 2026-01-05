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
  CheckCircle
} from 'lucide-react';

export interface SchoolMatch {
  id: number;
  city: string;
  province: string;
  school_type: string;
  age_groups: string[];
  salary_range: string;
  match_score: number;
  match_reasons: string[];
  is_submitted?: boolean;
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

export default function MatchCard({ match, children }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Header with Score and Action Button */}
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${getScoreGradient(match.match_score)} text-white font-bold text-lg shadow-md`}>
          {match.match_score}% Match
        </div>

        {/* Action button slot (QuickApplyButton will go here) */}
        <div className="ml-2">
          {children}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="text-xl font-semibold text-gray-900">
          {match.city}, {match.province}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
          {match.school_type}
        </span>
        {match.age_groups.map((age, idx) => (
          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {age}
          </span>
        ))}
        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
          💰 {match.salary_range}
        </span>
      </div>

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
