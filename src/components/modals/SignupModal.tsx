'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';
import Modal from './Modal';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const CHINA_CITIES = [
  'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu',
  'Hangzhou', 'Chongqing', 'Tianjin', 'Nanjing', 'Wuhan',
  'Xi\'an', 'Suzhou', 'Qingdao', 'Dalian', 'Ningbo'
];

const AGE_GROUPS = [
  { value: 'kindergarten', label: 'Kindergarten (3-6)' },
  { value: 'primary', label: 'Primary School (6-12)' },
  { value: 'middle_school', label: 'Middle School (12-15)' },
  { value: 'high_school', label: 'High School (15-18)' },
  { value: 'university', label: 'University (18+)' }
];

const SUBJECTS = [
  'English', 'Math', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Art', 'Music', 'PE', 'Computer Science'
];

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      preferredAgeGroup: [],
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        try {
          await apiClient.createTeacherSignup({
            user_id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            preferred_location: data.city,
            preferred_age_group: data.preferredAgeGroup.join(', '),
            subject_specialty: data.subjectSpecialty,
          });
        } catch (profileError: any) {
          console.error('Failed to create teacher profile:', profileError);
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Check your email!</h3>
          <p className="text-gray-600">
            We've sent you a verification email. Please click the link in the email to verify your account.
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-brand-red hover:text-red-700"
            >
              Sign in
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Compact two-column layout */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    id="firstName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    id="lastName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address *
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Preferred City in China *
                </label>
                <select
                  {...register('city')}
                  id="city"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                >
                  <option value="">Select a city</option>
                  {CHINA_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subjectSpecialty" className="block text-sm font-medium text-gray-700">
                  Subject Specialty *
                </label>
                <select
                  {...register('subjectSpecialty')}
                  id="subjectSpecialty"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.subjectSpecialty ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subjectSpecialty && (
                  <p className="mt-1 text-xs text-red-600">{errors.subjectSpecialty.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Age Groups *
                </label>
                <div className="space-y-1.5">
                  {AGE_GROUPS.map(({ value, label }) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={value}
                        {...register('preferredAgeGroup')}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredAgeGroup && (
                  <p className="mt-1 text-xs text-red-600">{errors.preferredAgeGroup.message}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </Modal>
  );
}
