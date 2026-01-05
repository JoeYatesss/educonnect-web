'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import type { CurrencyDetection } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencyData, setCurrencyData] = useState<CurrencyDetection | null>(null);
  const [loadingCurrency, setLoadingCurrency] = useState(true);

  // Detect currency when modal opens
  useEffect(() => {
    if (isOpen) {
      detectCurrency();
    }
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const detectCurrency = async () => {
    try {
      setLoadingCurrency(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log('[PaymentModal] No session found, using default currency');
        setLoadingCurrency(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('[PaymentModal] Fetching currency from:', `${API_URL}/api/v1/payments/detect-currency`);

      const response = await fetch(`${API_URL}/api/v1/payments/detect-currency`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      console.log('[PaymentModal] Response status:', response.status);

      if (response.ok) {
        const data: CurrencyDetection = await response.json();
        console.log('[PaymentModal] Currency data received:', data);
        console.log('[PaymentModal] Auto-detected currency:', data.effective_currency);
        setCurrencyData(data);
      } else {
        const errorText = await response.text();
        console.error('[PaymentModal] API error:', response.status, errorText);
      }
    } catch (err) {
      console.error('[PaymentModal] Currency detection error:', err);
    } finally {
      setLoadingCurrency(false);
    }
  };

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Please sign in to continue');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const checkoutData = {
        success_url: `${window.location.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/dashboard?payment=cancelled`,
        currency: currencyData?.effective_currency || 'USD',
      };

      console.log('[PaymentModal] Creating checkout with data:', checkoutData);

      const response = await fetch(`${API_URL}/api/v1/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      console.log('[PaymentModal] Checkout response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PaymentModal] Checkout error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || 'Payment failed' };
        }
        throw new Error(errorData.detail || `Failed to create checkout session (${response.status})`);
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-brand-red to-orange-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Unlock Your Opportunities</h2>
              <p className="text-white/90 text-sm">One-time payment • 90-day money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {[
              'Access to matched schools with full details',
              'View salary ranges and benefits packages',
              'Submit unlimited applications',
              'Direct contact with school administrators',
              'Profile visibility to 100+ partner schools',
              'Dedicated support from our placement team',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">{feature}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {loadingCurrency ? '...' : currencyData?.price_formatted || '£10'}
            </div>
            <p className="text-sm text-gray-600">One-time payment</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-brand-red hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Secure Payment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
