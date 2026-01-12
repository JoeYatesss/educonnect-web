'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ApplicationStatusModal from '@/components/admin/ApplicationStatusModal';
import CVViewerModal from '@/components/admin/CVViewerModal';
import VideoViewerModal from '@/components/admin/VideoViewerModal';
import { API_URL } from '@/lib/constants';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  years_experience: number | null;
  education: string | null;
  subject_specialty: string[] | null;
  preferred_location: string[] | null;
  preferred_age_group: string[] | null;
  cv_path: string | null;
  intro_video_path: string | null;
  headshot_photo_path: string | null;
  status: string;
  has_paid: boolean;
  cv_url?: string | null;
  headshot_url?: string | null;
  video_url?: string | null;
}

interface Match {
  id: number;
  school_id: number;
  match_score: number;
  match_reasons: string[];
  schools: {
    id: number;
    name: string;
    city: string;
    school_type: string;
    salary_range: string;
  };
}

interface Application {
  id: number;
  school_name: string;
  school_city: string;
  status: string;
  submitted_at: string;
  notes: string | null;
}

export default function TeacherDetailPage() {
  const { adminUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningMatching, setRunningMatching] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitNotes, setSubmitNotes] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [cvViewerOpen, setCvViewerOpen] = useState(false);
  const [videoViewerOpen, setVideoViewerOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/login');
    } else if (adminUser && teacherId) {
      fetchTeacherData();
    }
  }, [adminUser, authLoading, teacherId]);

  const fetchTeacherData = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      // Fetch teacher details
      const teacherResponse = await fetch(
        `${API_URL}/api/v1/admin/teachers/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!teacherResponse.ok) throw new Error('Failed to fetch teacher');
      const teacherData = await teacherResponse.json();
      setTeacher(teacherData);

      // Fetch matches
      const matchesResponse = await fetch(
        `${API_URL}/api/v1/matching/teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
      }

      // Fetch applications
      const applicationsResponse = await fetch(
        `${API_URL}/api/v1/applications/teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
      setLoading(false);
    }
  };

  const handleRunMatching = async () => {
    setRunningMatching(true);
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/matching/run?teacher_id=${teacherId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Matching failed');

      await fetchTeacherData();
    } catch (error) {
      console.error('Matching failed:', error);
      alert('Failed to run matching. Please try again.');
    } finally {
      setRunningMatching(false);
    }
  };

  const handleSubmitToSchools = async () => {
    if (selectedSchools.length === 0) return;

    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teacher_id: parseInt(teacherId),
            school_ids: selectedSchools,
            notes: submitNotes || null,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit applications');

      setSubmitModalOpen(false);
      setSelectedSchools([]);
      setSubmitNotes('');
      await fetchTeacherData();
      alert(`Successfully submitted to ${selectedSchools.length} school(s)!`);
    } catch (error) {
      console.error('Failed to submit applications:', error);
      alert('Failed to submit applications. Please try again.');
    }
  };

  const toggleSchoolSelection = (schoolId: number) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId) ? prev.filter((id) => id !== schoolId) : [...prev, schoolId]
    );
  };

  const handleOpenStatusModal = (application: Application) => {
    setSelectedApplication(application);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedApplication(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Teacher not found</h2>
          <Link href="/admin/teachers" className="mt-4 text-blue-600 hover:text-blue-700">
            Back to Teachers List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {teacher.first_name} {teacher.last_name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{teacher.email}</p>
            </div>
            <Link
              href="/admin/teachers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Teachers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>

              {/* Headshot */}
              {teacher.headshot_url ? (
                <div className="mb-4">
                  <img
                    src={teacher.headshot_url}
                    alt={`${teacher.first_name}'s headshot`}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{teacher.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                  <dd className="text-sm text-gray-900">{teacher.nationality || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="text-sm text-gray-900">
                    {teacher.years_experience ? `${teacher.years_experience} years` : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Education</dt>
                  <dd className="text-sm text-gray-900">{teacher.education || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd>
                    {teacher.has_paid ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Unpaid
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Documents */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">CV</label>
                  {teacher.cv_path ? (
                    <div className="mt-1">
                      <button
                        onClick={() => setCvViewerOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View CV →
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Not uploaded</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Intro Video</label>
                  {teacher.video_url ? (
                    <div className="mt-1">
                      <button
                        onClick={() => setVideoViewerOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Watch Video →
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Not uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Matches and Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matched Schools */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Matched Schools ({matches.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleRunMatching}
                    disabled={runningMatching}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {runningMatching ? 'Running...' : 'Run Matching'}
                  </button>
                  {selectedSchools.length > 0 && (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Submit to {selectedSchools.length} School{selectedSchools.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>

              {matches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No matches yet. Click "Run Matching" to find schools.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedSchools.includes(match.school_id)}
                            onChange={() => toggleSchoolSelection(match.school_id)}
                            className="mt-1 h-4 w-4 text-blue-600 rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {match.schools.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {match.schools.city} • {match.schools.school_type}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              {match.schools.salary_range}
                            </p>
                            {match.match_reasons.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {match.match_reasons.slice(0, 3).map((reason, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                                    <svg className="h-3 w-3 text-green-500 mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {match.match_score}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Applications */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Active Applications ({applications.length})
              </h2>
              {applications.length === 0 ? (
                <p className="text-sm text-gray-500">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{app.school_name}</h3>
                          <p className="text-sm text-gray-500">{app.school_city}</p>
                          {app.notes && (
                            <p className="text-sm text-gray-600 mt-1">{app.notes}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {app.status.replace(/_/g, ' ')}
                          </span>
                          <button
                            onClick={() => handleOpenStatusModal(app)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Update Status →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Submit to Schools
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You're about to submit {teacher.first_name} {teacher.last_name} to{' '}
              {selectedSchools.length} school{selectedSchools.length > 1 ? 's' : ''}.
            </p>
            <textarea
              placeholder="Add notes (optional)..."
              value={submitNotes}
              onChange={(e) => setSubmitNotes(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmitToSchools}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit Applications
              </button>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Status Modal */}
      {statusModalOpen && selectedApplication && (
        <ApplicationStatusModal
          isOpen={statusModalOpen}
          onClose={handleCloseStatusModal}
          application={selectedApplication}
          onUpdate={fetchTeacherData}
        />
      )}

      {/* CV Viewer Modal */}
      {teacher && (
        <CVViewerModal
          isOpen={cvViewerOpen}
          onClose={() => setCvViewerOpen(false)}
          teacherId={teacher.id}
          teacherName={`${teacher.first_name} ${teacher.last_name}`}
          cvPath={teacher.cv_path}
        />
      )}

      {/* Video Viewer Modal */}
      {teacher && (
        <VideoViewerModal
          isOpen={videoViewerOpen}
          onClose={() => setVideoViewerOpen(false)}
          teacherName={`${teacher.first_name} ${teacher.last_name}`}
          videoUrl={teacher.video_url}
        />
      )}
    </div>
  );
}
