'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';

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

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      preferredAgeGroup: [],
    },
  });

  // Debug: Watch form values for debugging (removed - too noisy)
  // Only log on submit now for security

  const onSubmit = async (data: SignupFormData) => {
    console.log('=== onSubmit FUNCTION CALLED ===');
    console.log('Received data:', {
      ...data,
      password: '***REDACTED***',
      confirmPassword: '***REDACTED***',
    });

    setError(null);
    console.log('Setting loading to true...');
    setLoading(true);
    console.log('Loading state set to:', true);

    try {
      console.log('Starting signup process...');

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Auth signup result:', { authData, signUpError });

      if (signUpError) throw signUpError;

      // Create teacher profile immediately using signup endpoint (no auth required)
      if (authData.user) {
        console.log('Creating teacher profile for user:', authData.user.id);

        try {
          const teacherProfile = await apiClient.createTeacherSignup({
            user_id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            preferred_location: data.city,
            linkedin: data.linkedin || undefined,
            preferred_age_group: data.preferredAgeGroup.join(', '),
            subject_specialty: data.subjectSpecialty,
          });

          console.log('Teacher profile created successfully:', teacherProfile);

          // Note: CV upload will be available after email verification and login
          if (cvFile) {
            console.log('CV will be available for upload after email verification');
          }
        } catch (profileError: any) {
          console.error('Failed to create teacher profile:', profileError);
          // Don't throw - allow signup to complete even if profile creation fails
          // User can contact support or profile can be created on first login
          console.warn('Signup successful but profile creation failed - will retry on first login');
        }
      }

      console.log('Setting success to true');
      setSuccess(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="rounded-md bg-green-50 p-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Check your email!
            </h3>
            <p className="text-sm text-green-700">
              We've sent you a verification email. Please click the link in the email to verify your account.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
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
                    <strong className="capitalize">{field}:</strong> {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  id="firstName"
                  type="text"
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  id="lastName"
                  type="text"
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Preferred City in China *
              </label>
              <select
                {...register('city')}
                id="city"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select a city</option>
                {CHINA_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
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
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select a subject</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errors.subjectSpecialty && (
                <p className="mt-1 text-sm text-red-600">{errors.subjectSpecialty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Age Groups *
              </label>
              <div className="space-y-2">
                {AGE_GROUPS.map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={value}
                      {...register('preferredAgeGroup')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              {errors.preferredAgeGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredAgeGroup.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile (Optional)
              </label>
              <input
                {...register('linkedin')}
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.linkedin ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                Upload CV (Optional)
              </label>
              <input
                type="file"
                id="cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              onClick={() => console.log('Submit button clicked, loading:', loading, 'disabled:', loading, 'errors:', Object.keys(errors).length)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
