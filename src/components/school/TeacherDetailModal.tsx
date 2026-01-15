'use client';

import { useState } from 'react';
import { TeacherFull } from '@/types';
import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Download,
  Heart,
  ExternalLink,
  User,
  MessageCircle,
} from 'lucide-react';

interface TeacherDetailModalProps {
  teacher: TeacherFull;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
}

export default function TeacherDetailModal({
  teacher,
  isOpen,
  onClose,
  isSaved = false,
  onSave,
  onUnsave,
}: TeacherDetailModalProps) {
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {teacher.first_name} {teacher.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToggle}
                disabled={saving}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Photo & Contact */}
                <div className="space-y-4">
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
                    {teacher.headshot_url ? (
                      <img
                        src={teacher.headshot_url}
                        alt={`${teacher.first_name} ${teacher.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>

                    {teacher.email && (
                      <a
                        href={`mailto:${teacher.email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </a>
                    )}

                    {teacher.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {teacher.country_code} {teacher.phone}
                      </a>
                    )}

                    {teacher.wechat_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        WeChat: {teacher.wechat_id}
                      </div>
                    )}

                    {teacher.linkedin && (
                      <a
                        href={teacher.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>

                  {/* Download CV */}
                  {teacher.cv_url && (
                    <a
                      href={teacher.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-red text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download CV
                    </a>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {teacher.preferred_location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Preferred Location</p>
                            <p className="text-sm text-gray-900">{teacher.preferred_location}</p>
                          </div>
                        </div>
                      )}

                      {teacher.subject_specialty && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Subject Specialty</p>
                            <p className="text-sm text-gray-900">{teacher.subject_specialty}</p>
                          </div>
                        </div>
                      )}

                      {teacher.preferred_age_group && (
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Age Group</p>
                            <p className="text-sm text-gray-900">{teacher.preferred_age_group}</p>
                          </div>
                        </div>
                      )}

                      {teacher.years_experience !== null && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="text-sm text-gray-900">{teacher.years_experience} years</p>
                          </div>
                        </div>
                      )}

                      {teacher.nationality && (
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Nationality</p>
                            <p className="text-sm text-gray-900">{teacher.nationality}</p>
                          </div>
                        </div>
                      )}

                      {teacher.education && (
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Education</p>
                            <p className="text-sm text-gray-900">{teacher.education}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teaching Experience */}
                  {teacher.teaching_experience && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Teaching Experience</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {teacher.teaching_experience}
                      </p>
                    </div>
                  )}

                  {/* Professional Experience */}
                  {teacher.professional_experience && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Professional Experience</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {teacher.professional_experience}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  {teacher.additional_info && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {teacher.additional_info}
                      </p>
                    </div>
                  )}

                  {/* Video */}
                  {teacher.video_url && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Introduction Video</h3>
                      <video
                        controls
                        className="w-full rounded-xl bg-gray-100"
                        src={teacher.video_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
