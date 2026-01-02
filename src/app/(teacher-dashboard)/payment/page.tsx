'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getStripe } from '@/lib/stripe/client';

export default function PaymentPage() {
  const { teacher } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already paid
  if (teacher?.has_paid) {
    router.push('/dashboard');
    return null;
  }

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await (await fetch('/api/auth/session')).json()).access_token}`,
          },
          body: JSON.stringify({
            success_url: `${window.location.origin}/dashboard?payment=success`,
            cancel_url: `${window.location.origin}/payment?canceled=true`,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Unlock Your Teaching Opportunities</h1>
            <p className="mt-2 text-blue-100">
              Get matched with top schools in China and start your teaching journey
            </p>
          </div>

          {/* Pricing */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-end justify-center">
              <span className="text-5xl font-bold text-gray-900">$99</span>
              <span className="text-2xl text-gray-500 ml-2">.00</span>
            </div>
            <p className="mt-2 text-center text-gray-600">One-time payment</p>
          </div>

          {/* Features */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's included:</h2>
            <ul className="space-y-3">
              {[
                'Access to our advanced school matching algorithm',
                'View matched schools with salary and location details',
                'We apply to schools on your behalf',
                'Track your application progress in real-time',
                'Professional profile showcase to schools',
                'Direct support from our placement team',
                'Unlimited school applications',
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* CTA */}
          <div className="px-6 py-8 bg-gray-50">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Continue to Payment'}
            </button>
            <p className="mt-3 text-center text-sm text-gray-500">
              Secure payment powered by Stripe
            </p>
          </div>

          {/* Money-back guarantee */}
          <div className="px-6 py-4 bg-blue-50 text-center">
            <p className="text-sm text-blue-800">
              <strong>Money-back guarantee:</strong> If we don't find you a suitable match within 90
              days, we'll refund your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
