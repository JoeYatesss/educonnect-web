'use client';

import { useState } from 'react';
import { TeacherPreview, TeacherFull } from '@/types';
import { MapPin, Briefcase, GraduationCap, FileText, Video, Heart, Eye, Lock, User } from 'lucide-react';

interface TeacherCardProps {
  teacher: TeacherPreview | TeacherFull;
  hasPaid: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
  onView?: () => void;
}

function isTeacherFull(teacher: TeacherPreview | TeacherFull): teacher is TeacherFull {
  return 'first_name' in teacher;
}

export default function TeacherCard({
  teacher,
  hasPaid,
  isSaved = false,
  onSave,
  onUnsave,
  onView,
}: TeacherCardProps) {
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved && onUnsave) {
        await onUnsave();
      } else if (!isSaved && onSave) {
        await onSave();
      }
    } finally {
      setSaving(false);
    }
  };

  const isFull = isTeacherFull(teacher);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header with Photo */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {isFull && teacher.headshot_url ? (
          <img
            src={teacher.headshot_url}
            alt={`${teacher.first_name} ${teacher.last_name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {hasPaid ? (
              <User className="w-16 h-16 text-gray-400" />
            ) : (
              <div className="text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Unlock to view photo</span>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        {hasPaid && (
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
              isSaved
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {(isFull ? teacher.cv_path : (teacher as TeacherPreview).has_cv) && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <FileText className="w-3 h-3" />
              CV
            </span>
          )}
          {(isFull ? teacher.intro_video_path : (teacher as TeacherPreview).has_video) && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Video className="w-3 h-3" />
              Video
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name/ID */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {isFull ? (
            `${teacher.first_name} ${teacher.last_name}`
          ) : (
            <span className="text-gray-400">Teacher #{teacher.id}</span>
          )}
        </h3>

        {/* Info */}
        <div className="space-y-2 mb-4">
          {(isFull ? teacher.preferred_location : (teacher as TeacherPreview).preferred_location) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{isFull ? teacher.preferred_location : (teacher as TeacherPreview).preferred_location}</span>
            </div>
          )}

          {(isFull ? teacher.subject_specialty : (teacher as TeacherPreview).subject_specialty) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{isFull ? teacher.subject_specialty : (teacher as TeacherPreview).subject_specialty}</span>
            </div>
          )}

          {(isFull ? teacher.preferred_age_group : (teacher as TeacherPreview).preferred_age_group) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span>{isFull ? teacher.preferred_age_group : (teacher as TeacherPreview).preferred_age_group}</span>
            </div>
          )}

          {(isFull ? teacher.years_experience : (teacher as TeacherPreview).years_experience) !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>
                {isFull ? teacher.years_experience : (teacher as TeacherPreview).years_experience} years experience
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {hasPaid ? (
          <button
            onClick={onView}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-brand-red text-brand-red font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Full Profile
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
            <Lock className="w-4 h-4" />
            Unlock to view details
          </div>
        )}
      </div>
    </div>
  );
}
