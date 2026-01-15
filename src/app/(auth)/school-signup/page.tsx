'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';
import { schoolSignupSchema, type SchoolSignupFormData } from '@/lib/validations';

const RECRUITMENT_VOLUMES = [
  { value: '1-5', label: '1-5 teachers per year' },
  { value: '6-10', label: '6-10 teachers per year' },
  { value: '11-20', label: '11-20 teachers per year' },
  { value: '20+', label: '20+ teachers per year' },
];

export default function SchoolSignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolSignupFormData>({
    resolver: zodResolver(schoolSignupSchema),
  });

  const onSubmit = async (data: SchoolSignupFormData) => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Step 1: Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/school-dashboard`,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please log in instead.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // Step 2: Create school account in our database
      await apiClient.createSchoolAccount({
        user_id: authData.user.id,
        school_name: data.schoolName,
        city: data.city,
        contact_name: data.contactName,
        contact_email: data.email,
        contact_phone: data.contactPhone || undefined,
        wechat_id: data.wechatId || undefined,
        annual_recruitment_volume: data.annualRecruitmentVolume,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('School signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-8">
        <div className="rounded-md bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Account Created Successfully!
          </h2>
          <p className="text-green-700 mb-4">
            We&apos;ve sent a verification email to your inbox. Please click the link in the email to verify your account.
          </p>
          <p className="text-sm text-green-600">
            After verification, you&apos;ll be able to log in and access your school dashboard.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your School
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="rounded-md bg-yellow-50 p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="list-disc list-inside text-sm text-yellow-700">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <strong className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</strong> {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Account Credentials Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Account Credentials</h3>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="school@example.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Min 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Re-enter password"
              />
            </div>
          </div>
        </div>

        {/* School Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">School Information</h3>

          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
              School Name *
            </label>
            <input
              {...register('schoolName')}
              id="schoolName"
              type="text"
              className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors.schoolName ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="International School of Beijing"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              {...register('city')}
              id="city"
              type="text"
              className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Beijing"
            />
          </div>

          <div>
            <label htmlFor="annualRecruitmentVolume" className="block text-sm font-medium text-gray-700">
              Annual Teacher Recruitment *
            </label>
            <select
              {...register('annualRecruitmentVolume')}
              id="annualRecruitmentVolume"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.annualRecruitmentVolume ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
              Contact Name *
            </label>
            <input
              {...register('contactName')}
              id="contactName"
              type="text"
              className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors.contactName ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="John Smith"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register('contactPhone')}
                id="contactPhone"
                type="tel"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+86 138 xxxx xxxx"
              />
            </div>

            <div>
              <label htmlFor="wechatId" className="block text-sm font-medium text-gray-700">
                WeChat ID
              </label>
              <input
                {...register('wechatId')}
                id="wechatId"
                type="text"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="wechat_id"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create School Account'}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
