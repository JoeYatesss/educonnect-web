'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import type { AuthError } from '@/types';

export default function LoginPage() {
  const { signIn, resendConfirmation } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // States for improved error handling
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Debug: removed form watching - too noisy and security risk
  // Only log on submit now

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setShowResendOption(false);
    setResendSuccess(false);
    setShowCreateAccountPrompt(false);
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const authError = err as AuthError;
      if (authError.code === 'EMAIL_NOT_CONFIRMED') {
        setShowResendOption(true);
        setResendEmail(authError.email || data.email);
      } else if (authError.code === 'ACCOUNT_NOT_FOUND') {
        setShowCreateAccountPrompt(true);
      }
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
    // Note: We intentionally don't set loading to false on success
    // Let the redirect happen while still showing loading state
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      await resendConfirmation(resendEmail);
      setResendSuccess(true);
      setShowResendOption(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
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
              {/* Resend Confirmation Option */}
              {showResendOption && !resendSuccess && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : "Didn't receive it? Resend confirmation email"}
                </button>
              )}
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Confirmation email sent! Please check your inbox.
              </p>
            </div>
          )}

          {/* Create Account Prompt */}
          {showCreateAccountPrompt && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-800">
                Would you like to create an account?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  Sign up here
                </Link>
              </p>
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

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
    </div>
  );
}
