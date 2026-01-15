'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import { SchoolJobCreate } from '@/types';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { SUBJECTS, AGE_GROUPS } from '@/lib/constants/teacherOptions';

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: '0-2 years', label: '0-2 years' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '5+ years', label: '5+ years' },
];

const ROLE_TYPES = [
  { value: '', label: 'Select role type' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'head_of_department', label: 'Head of Department' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'counselor', label: 'Counselor' },
];

export default function CreateJobPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SchoolJobCreate>({
    title: '',
    role_type: '',
    city: '',
    province: '',
    school_info: '',
    subjects: [],
    age_groups: [],
    experience_required: '',
    chinese_required: false,
    qualification: '',
    salary_min: undefined,
    salary_max: undefined,
    salary_display: '',
    description: '',
    key_responsibilities: '',
    requirements: '',
    benefits: '',
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && schoolAccount && !schoolAccount.has_paid) {
      router.push('/school-dashboard');
    }
  }, [authLoading, schoolAccount, router]);

  // Pre-fill city from school account
  useEffect(() => {
    if (schoolAccount?.city && !formData.city) {
      setFormData(prev => ({ ...prev, city: schoolAccount.city }));
    }
  }, [schoolAccount, formData.city]);

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...(prev.subjects || []), subject]
    }));
  };

  const handleAgeGroupToggle = (ageGroup: string) => {
    setFormData(prev => ({
      ...prev,
      age_groups: prev.age_groups?.includes(ageGroup)
        ? prev.age_groups.filter(a => a !== ageGroup)
        : [...(prev.age_groups || []), ageGroup]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }

    setSaving(true);
    try {
      // Build salary display if min/max provided
      let salary_display = formData.salary_display;
      if (!salary_display && (formData.salary_min || formData.salary_max)) {
        if (formData.salary_min && formData.salary_max) {
          salary_display = `${formData.salary_min.toLocaleString()} - ${formData.salary_max.toLocaleString()} RMB/month`;
        } else if (formData.salary_min) {
          salary_display = `From ${formData.salary_min.toLocaleString()} RMB/month`;
        } else if (formData.salary_max) {
          salary_display = `Up to ${formData.salary_max.toLocaleString()} RMB/month`;
        }
      }

      const jobData: SchoolJobCreate = {
        ...formData,
        salary_display,
      };

      const job = await apiClient.createSchoolJob(jobData);
      router.push(`/my-jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setSaving(false);
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

  if (!schoolAccount?.has_paid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/my-jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job</h1>
            <p className="text-gray-600">
              Fill in the details below to create a new job posting
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-red" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., English Teacher, Math Department Head"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Type
                  </label>
                  <select
                    value={formData.role_type || ''}
                    onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    {ROLE_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Shanghai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subjects Required</h2>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.subjects?.includes(subject)
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Age Groups</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AGE_GROUPS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAgeGroupToggle(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.age_groups?.includes(value)
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Required
                  </label>
                  <select
                    value={formData.experience_required || ''}
                    onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    {EXPERIENCE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., Bachelor's degree, TEFL certification"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.chinese_required}
                      onChange={(e) => setFormData({ ...formData, chinese_required: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-sm font-medium text-gray-700">Chinese language required</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Salary (RMB/month)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_min || ''}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="e.g., 20000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Salary (RMB/month)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_max || ''}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="e.g., 35000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Custom Display
                  </label>
                  <input
                    type="text"
                    value={formData.salary_display || ''}
                    onChange={(e) => setFormData({ ...formData, salary_display: e.target.value })}
                    placeholder="e.g., Competitive salary"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe the role and what you're looking for..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={formData.key_responsibilities || ''}
                    onChange={(e) => setFormData({ ...formData, key_responsibilities: e.target.value })}
                    rows={4}
                    placeholder="List the main responsibilities..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <textarea
                    value={formData.requirements || ''}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                    placeholder="List the requirements..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  <textarea
                    value={formData.benefits || ''}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={4}
                    placeholder="List the benefits offered..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About the School
                  </label>
                  <textarea
                    value={formData.school_info || ''}
                    onChange={(e) => setFormData({ ...formData, school_info: e.target.value })}
                    rows={4}
                    placeholder="Tell teachers about your school..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/my-jobs"
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-red hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
