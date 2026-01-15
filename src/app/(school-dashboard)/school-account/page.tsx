'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Users,
  CheckCircle2,
  Save,
} from 'lucide-react';

interface AccountFormData {
  school_name: string;
  city: string;
  contact_name: string;
  contact_phone: string;
  wechat_id: string;
  annual_recruitment_volume: string;
}

const RECRUITMENT_VOLUMES = [
  { value: '1-5', label: '1-5 teachers per year' },
  { value: '6-10', label: '6-10 teachers per year' },
  { value: '11-20', label: '11-20 teachers per year' },
  { value: '20+', label: '20+ teachers per year' },
];

export default function SchoolAccountPage() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AccountFormData>({
    defaultValues: {
      school_name: '',
      city: '',
      contact_name: '',
      contact_phone: '',
      wechat_id: '',
      annual_recruitment_volume: '',
    },
  });

  // Populate form with school data
  useEffect(() => {
    if (schoolAccount) {
      reset({
        school_name: schoolAccount.school_name || '',
        city: schoolAccount.city || '',
        contact_name: schoolAccount.contact_name || '',
        contact_phone: schoolAccount.contact_phone || '',
        wechat_id: schoolAccount.wechat_id || '',
        annual_recruitment_volume: schoolAccount.annual_recruitment_volume || '',
      });
    }
  }, [schoolAccount, reset]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const onSubmit = async (data: AccountFormData) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiClient.updateSchoolAccount(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update account:', err);
      setError(err.message || 'Failed to save changes');
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

  if (!schoolAccount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My School Account</h1>
            <p className="text-gray-600">Manage your school profile and settings</p>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    schoolAccount.has_paid ? 'bg-green-100' : 'bg-yellow-100'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      schoolAccount.has_paid ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscription</p>
                  <p
                    className={`font-semibold ${
                      schoolAccount.has_paid ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {schoolAccount.has_paid ? 'Full Access' : 'Limited Access'}
                  </p>
                </div>
              </div>

              {schoolAccount.payment_date && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(schoolAccount.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Email</p>
                  <p className="font-medium text-gray-900">{schoolAccount.contact_email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(schoolAccount.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">School Information</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700">Changes saved successfully!</p>
                </div>
              )}

              <div className="space-y-6">
                {/* School Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      School Name
                    </div>
                  </label>
                  <input
                    {...register('school_name', { required: 'School name is required' })}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                      errors.school_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.school_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.school_name.message}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      City
                    </div>
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      Contact Name
                    </div>
                  </label>
                  <input
                    {...register('contact_name')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Phone Number
                    </div>
                  </label>
                  <input
                    {...register('contact_phone')}
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                    placeholder="+86 138 xxxx xxxx"
                  />
                </div>

                {/* WeChat ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      WeChat ID
                    </div>
                  </label>
                  <input
                    {...register('wechat_id')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                  />
                </div>

                {/* Annual Recruitment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      Annual Recruitment Volume
                    </div>
                  </label>
                  <select
                    {...register('annual_recruitment_volume')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                  >
                    <option value="">Select recruitment volume</option>
                    {RECRUITMENT_VOLUMES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>

          {/* Need Help */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Contact our school support team for assistance with your account.
            </p>
            <a
              href="mailto:schools@educonnect.com"
              className="text-brand-red font-medium hover:underline"
            >
              schools@educonnect.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
