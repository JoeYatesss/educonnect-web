'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import TeacherDetailModal from '@/components/school/TeacherDetailModal';
import { apiClient } from '@/lib/api/client';
import { SavedTeacher, TeacherFull } from '@/types';
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Video,
  Eye,
  Trash2,
  Search,
  User,
} from 'lucide-react';

export default function SavedTeachersPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [savedTeachers, setSavedTeachers] = useState<SavedTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherFull | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch saved teachers
  const fetchSavedTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const saved = await apiClient.getSavedTeachers();
      setSavedTeachers(saved);
    } catch (err) {
      console.error('Failed to fetch saved teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Redirect unpaid schools to dashboard
  useEffect(() => {
    if (!authLoading && schoolAccount && !schoolAccount.has_paid) {
      router.push('/school-dashboard');
    }
  }, [authLoading, schoolAccount, router]);

  useEffect(() => {
    if (schoolAccount?.has_paid) {
      fetchSavedTeachers();
    }
  }, [schoolAccount, fetchSavedTeachers]);

  const handleViewTeacher = async (teacherId: number) => {
    setModalLoading(true);
    try {
      const teacher = await apiClient.getTeacherProfile(teacherId);
      setSelectedTeacher(teacher);
    } catch (err) {
      console.error('Failed to fetch teacher:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUnsaveTeacher = async (teacherId: number) => {
    try {
      await apiClient.unsaveTeacher(teacherId);
      setSavedTeachers((prev) => prev.filter((s) => s.teacher.id !== teacherId));
      if (selectedTeacher?.id === teacherId) {
        setSelectedTeacher(null);
      }
    } catch (err) {
      console.error('Failed to unsave teacher:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not a school or hasn't paid (redirect will happen)
  if (!schoolAccount || !schoolAccount.has_paid) {
    return null;
  }

  const isTeacherFull = (teacher: any): teacher is TeacherFull => {
    return 'first_name' in teacher;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Teachers</h1>
            <p className="text-gray-600">
              {savedTeachers.length} teacher{savedTeachers.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
            </div>
          ) : savedTeachers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved teachers</h3>
              <p className="text-gray-600 mb-4">
                Start browsing teachers and save the ones you&apos;re interested in.
              </p>
              <Link
                href="/find-talent"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse Teachers
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedTeachers.map((saved) => {
                const teacher = saved.teacher;
                const isFull = isTeacherFull(teacher);

                return (
                  <div
                    key={saved.saved_id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Photo */}
                      <div className="sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0">
                        {isFull && teacher.headshot_url ? (
                          <img
                            src={teacher.headshot_url}
                            alt={`${teacher.first_name} ${teacher.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {isFull
                                ? `${teacher.first_name} ${teacher.last_name}`
                                : `Teacher #${teacher.id}`}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {(isFull ? teacher.cv_path : teacher.has_cv) && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  CV
                                </span>
                              )}
                              {(isFull ? teacher.intro_video_path : teacher.has_video) && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Video
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-xs text-gray-500">
                            Saved {new Date(saved.saved_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          {teacher.preferred_location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {teacher.preferred_location}
                            </div>
                          )}
                          {teacher.subject_specialty && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              {teacher.subject_specialty}
                            </div>
                          )}
                          {teacher.preferred_age_group && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              {teacher.preferred_age_group}
                            </div>
                          )}
                        </div>

                        {saved.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {saved.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewTeacher(teacher.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-brand-red text-brand-red font-medium rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          <button
                            onClick={() => handleUnsaveTeacher(teacher.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          isSaved={true}
          onUnsave={() => handleUnsaveTeacher(selectedTeacher.id)}
        />
      )}

      {/* Modal Loading Overlay */}
      {modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto" />
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}
