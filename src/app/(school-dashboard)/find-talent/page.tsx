'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import TeacherCard from '@/components/school/TeacherCard';
import TeacherDetailModal from '@/components/school/TeacherDetailModal';
import { apiClient } from '@/lib/api/client';
import { TeacherPreview, TeacherFull } from '@/types';
import { Search, Filter, ChevronDown, X, Users } from 'lucide-react';
import { CHINA_CITIES, SUBJECTS, AGE_GROUP_VALUES } from '@/lib/constants/teacherOptions';

export default function FindTalentPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [teachers, setTeachers] = useState<TeacherPreview[]>([]);
  const [total, setTotal] = useState(0);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedTeacherIds, setSavedTeacherIds] = useState<Set<number>>(new Set());

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const limit = 12;

  // Modal
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherFull | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.browseTeachers({
        search: search || undefined,
        location: location || undefined,
        subject: subject || undefined,
        age_group: ageGroup || undefined,
        skip: page * limit,
        limit,
      });

      setTeachers(data.teachers || []);
      setTotal(data.total || 0);
      setHasFullAccess(data.has_full_access ?? false);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [search, location, subject, ageGroup, page, limit]);

  // Fetch saved teachers
  const fetchSavedTeachers = useCallback(async () => {
    if (!schoolAccount?.has_paid) return;

    try {
      const saved = await apiClient.getSavedTeachers();
      setSavedTeacherIds(new Set(saved.map((s) => s.teacher.id)));
    } catch (err) {
      console.error('Failed to fetch saved teachers:', err);
    }
  }, [schoolAccount?.has_paid]);

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
      fetchTeachers();
      fetchSavedTeachers();
    }
  }, [schoolAccount, fetchTeachers, fetchSavedTeachers]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, location, subject, ageGroup]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setSubject('');
    setAgeGroup('');
  };

  const handleViewTeacher = async (teacherId: number) => {
    if (!hasFullAccess) return;

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

  const handleSaveTeacher = async (teacherId: number) => {
    try {
      await apiClient.saveTeacher(teacherId);
      setSavedTeacherIds((prev) => new Set([...prev, teacherId]));
    } catch (err) {
      console.error('Failed to save teacher:', err);
    }
  };

  const handleUnsaveTeacher = async (teacherId: number) => {
    try {
      await apiClient.unsaveTeacher(teacherId);
      setSavedTeacherIds((prev) => {
        const next = new Set(prev);
        next.delete(teacherId);
        return next;
      });
    } catch (err) {
      console.error('Failed to unsave teacher:', err);
    }
  };

  const activeFiltersCount = [location, subject, ageGroup].filter(Boolean).length;
  const totalPages = Math.ceil(total / limit);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Talent</h1>
            <p className="text-gray-600">
              Browse our database of {total} qualified teachers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, location, or subject..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'border-brand-red text-brand-red bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-brand-red text-white rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-brand-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                    >
                      <option value="">All locations</option>
                      {CHINA_CITIES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                    >
                      <option value="">All subjects</option>
                      {SUBJECTS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                    >
                      <option value="">All age groups</option>
                      {AGE_GROUP_VALUES.map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find more results.
              </p>
              <button
                onClick={clearFilters}
                className="text-brand-red font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Teacher Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    hasPaid={hasFullAccess}
                    isSaved={savedTeacherIds.has(teacher.id)}
                    onSave={() => handleSaveTeacher(teacher.id)}
                    onUnsave={() => handleUnsaveTeacher(teacher.id)}
                    onView={() => handleViewTeacher(teacher.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          isSaved={savedTeacherIds.has(selectedTeacher.id)}
          onSave={() => handleSaveTeacher(selectedTeacher.id)}
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
