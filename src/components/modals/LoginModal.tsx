'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  loginSchema,
  magicLinkSchema,
  type LoginFormData,
  type MagicLinkFormData,
} from '@/lib/validations';
import Modal from './Modal';

type AuthTab = 'magic-link' | 'email-password';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { signIn, signInWithMagicLink } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>('magic-link');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const passwordForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onMagicLinkSubmit = async (data: MagicLinkFormData) => {
    setError(null);
    setLoading(true);

    try {
      await signInWithMagicLink(data.email);
      setSentEmail(data.email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      passwordForm.reset();
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    passwordForm.reset();
    magicLinkForm.reset();
    setError(null);
    setMagicLinkSent(false);
    setSentEmail('');
    setActiveTab('magic-link');
    onClose();
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-brand-red hover:text-red-700"
            >
              create a new account
            </button>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => handleTabChange('magic-link')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'magic-link'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('email-password')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'email-password'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Magic Link Tab - Form */}
        {activeTab === 'magic-link' && !magicLinkSent && (
          <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} noValidate className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...magicLinkForm.register('email')}
                id="magic-email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  magicLinkForm.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm`}
                placeholder="you@example.com"
              />
              {magicLinkForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {magicLinkForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              We'll send you a magic link to sign in without a password.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}

        {/* Magic Link Tab - Success State */}
        {activeTab === 'magic-link' && magicLinkSent && (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Check your email!</h3>
            <p className="text-gray-600">
              We've sent a sign-in link to <strong>{sentEmail}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800 font-medium mb-2">What to do next:</p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the sign-in link in the email</li>
                <li>You'll be automatically signed in</li>
              </ol>
            </div>
            <p className="text-xs text-gray-500">
              The link will expire in 1 hour for security reasons.
            </p>
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setSentEmail('');
                magicLinkForm.reset();
              }}
              className="text-sm text-brand-red hover:text-red-700 font-medium"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* Email & Password Tab */}
        {activeTab === 'email-password' && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...passwordForm.register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  passwordForm.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm`}
                placeholder="you@example.com"
              />
              {passwordForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...passwordForm.register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  passwordForm.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm`}
                placeholder="••••••••"
              />
              {passwordForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-gray-600 hover:text-gray-900"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
