'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';

export default function ResetPasswordPage() {
  const { user, updatePassword } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validatingSession, setValidatingSession] = useState(true);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Validate that user has a valid session from email link
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setError('Invalid or expired password reset link. Please request a new one.');
        setValidatingSession(false);
      } else {
        setValidatingSession(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setLoading(true);

    try {
      await updatePassword(data.password);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      // Provide helpful error messages
      if (err.message?.includes('session')) {
        setError('Your password reset session has expired. Please request a new reset link.');
      } else {
        setError(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating session
  if (validatingSession) {
    return (
      <div className="w-full text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Validating your reset link...</p>
      </div>
    );
  }

  // Invalid session - show error and link to request new reset
  if (!user) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Invalid Reset Link
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {error || 'This password reset link is invalid or has expired.'}
          </p>
          <p className="text-sm text-red-700">
            Password reset links expire after being used once or after a certain time period.
          </p>
        </div>
        <div className="text-center space-y-3">
          <Link
            href="/forgot-password"
            className="block w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium"
          >
            Request new reset link
          </Link>
          <Link
            href="/"
            className="block text-blue-600 hover:text-blue-500"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-md bg-green-50 p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Password updated successfully!
          </h3>
          <p className="text-sm text-green-700">
            Your password has been changed. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  // Main form (only shown when valid session exists)
  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a strong password for your account.
        </p>
      </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={loading}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={loading}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating password...' : 'Update password'}
            </button>
          </div>
        </form>
    </div>
  );
}
