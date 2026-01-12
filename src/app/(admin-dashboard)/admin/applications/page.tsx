'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ApplicationStatusModal from '@/components/admin/ApplicationStatusModal';
import { API_URL } from '@/lib/constants';

interface Application {
  id: number;
  teacher_id: number;
  school_id: number | null;
  job_id?: number | null;
  status: string;
  submitted_at: string;
  notes: string | null;
  role_name: string | null;
  expiry_date: string | null;
  is_job_application?: boolean;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    nationality: string;
  };
  school: {
    id: number;
    name: string;
    city: string;
    province: string;
    school_type: string;
  } | null;
  job?: {
    id: number;
    title: string;
    company: string;
    city: string;
    province: string;
    external_url?: string;
    source?: string;
  } | null;
}

export default function ApplicationsOverviewPage() {
  const { adminUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<{
    id: number;
    school_name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/login');
    } else if (adminUser) {
      fetchApplications();
    }
  }, [adminUser, authLoading]);

  const fetchApplications = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client'))
        .createClient()
        .auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app: Application) => {
    setSelectedApplication({
      id: app.id,
      school_name: app.school?.name || app.job?.company || 'Unknown',
      status: app.status,
    });
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedApplication(null);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.school?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || app.status === filterStatus;
    const matchesCity = !filterCity || app.school?.city === filterCity || app.job?.city === filterCity;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const uniqueCities = Array.from(new Set(applications.map((app) => app.school?.city || app.job?.city).filter(Boolean))).sort();
  const uniqueStatuses = Array.from(new Set(applications.map((app) => app.status))).sort();

  const statusColors: { [key: string]: string } = {
    submitted: 'bg-blue-100 text-blue-800',
    document_verification: 'bg-yellow-100 text-yellow-800',
    school_matching: 'bg-purple-100 text-purple-800',
    interview_scheduled: 'bg-indigo-100 text-indigo-800',
    interview_completed: 'bg-pink-100 text-pink-800',
    offer_extended: 'bg-green-100 text-green-800',
    placed: 'bg-green-200 text-green-900',
    declined: 'bg-red-100 text-red-800',
  };

  const getStatusBadge = (status: string) => {
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
              <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage applications across all teachers
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">
              {
                applications.filter(
                  (app) =>
                    !['placed', 'declined'].includes(app.status)
                ).length
              }
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Placed</p>
            <p className="text-2xl font-bold text-green-600">
              {applications.filter((app) => app.status === 'placed').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Declined</p>
            <p className="text-2xl font-bold text-red-600">
              {applications.filter((app) => app.status === 'declined').length}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by teacher name or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isExpired = app.expiry_date && new Date(app.expiry_date) < new Date();
                  const isExpiringSoon = app.expiry_date && !isExpired &&
                    (new Date(app.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;

                  return (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {app.teacher.first_name} {app.teacher.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{app.teacher.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {app.school?.name || app.job?.title || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.school?.school_type || app.job?.company || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.role_name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {app.school?.city || app.job?.city || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.school?.province || app.job?.province || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(app.submitted_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.expiry_date ? (
                          <div className={`text-sm ${
                            isExpired
                              ? 'text-red-600 font-medium'
                              : isExpiringSoon
                                ? 'text-amber-600 font-medium'
                                : 'text-gray-900'
                          }`}>
                            {isExpired ? 'Expired' : new Date(app.expiry_date).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenStatusModal(app)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Update Status
                        </button>
                        <Link
                          href={`/admin/teachers/${app.teacher_id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Teacher
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Status Modal */}
      {statusModalOpen && selectedApplication && (
        <ApplicationStatusModal
          isOpen={statusModalOpen}
          onClose={handleCloseStatusModal}
          application={selectedApplication}
          onUpdate={fetchApplications}
        />
      )}
    </div>
  );
}
