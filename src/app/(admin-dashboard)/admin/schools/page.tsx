'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/constants';

interface Job {
  id: number;
  title: string;
  company: string;
  city: string;
  province: string;
  school_type: string | null;
  salary: string | null;
  is_active: boolean;
  external_url: string | null;
  created_at: string;
}

interface CompanyGroup {
  company: string;
  jobs: Job[];
  cities: string[];
  provinces: string[];
}

export default function SchoolsManagementPage() {
  const { adminUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/login');
    } else if (adminUser) {
      fetchJobs();
    }
  }, [adminUser, authLoading]);

  const fetchJobs = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setLoading(false);
    }
  };

  // Group jobs by company
  const companyGroups: CompanyGroup[] = Object.values(
    jobs.reduce((acc: { [key: string]: CompanyGroup }, job) => {
      const company = job.company || 'Unknown';
      if (!acc[company]) {
        acc[company] = {
          company,
          jobs: [],
          cities: [],
          provinces: [],
        };
      }
      acc[company].jobs.push(job);
      if (job.city && !acc[company].cities.includes(job.city)) {
        acc[company].cities.push(job.city);
      }
      if (job.province && !acc[company].provinces.includes(job.province)) {
        acc[company].provinces.push(job.province);
      }
      return acc;
    }, {})
  ).sort((a, b) => b.jobs.length - a.jobs.length);

  const filteredCompanies = companyGroups.filter((group) => {
    const matchesSearch =
      group.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = !filterCity || group.cities.includes(filterCity);
    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(jobs.map((j) => j.city).filter(Boolean))).sort();

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
              <h1 className="text-3xl font-bold text-gray-900">Schools & Employers</h1>
              <p className="mt-1 text-sm text-gray-500">
                View all schools and employers from job listings ({companyGroups.length} companies, {jobs.length} jobs)
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
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by company name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
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

        {/* Companies Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Jobs
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    No companies found.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((group) => (
                  <tr key={group.company} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{group.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{group.cities.join(', ')}</div>
                      <div className="text-sm text-gray-500">{group.provinces.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {group.jobs.length} job{group.jobs.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/jobs?company=${encodeURIComponent(group.company)}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Jobs
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
