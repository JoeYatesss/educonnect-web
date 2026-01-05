'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import PaymentModal from './PaymentModal';

export default function PaymentGate() {
  const { teacher } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState('$14.99'); // Default to USD

  const detectPrice = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log('[PaymentGate] No session found, using default price');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('[PaymentGate] Fetching currency from:', `${API_URL}/api/v1/payments/detect-currency`);

      const response = await fetch(`${API_URL}/api/v1/payments/detect-currency`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      console.log('[PaymentGate] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[PaymentGate] Currency data:', data);
        setPriceDisplay(data.price_formatted);
      } else {
        const errorText = await response.text();
        console.error('[PaymentGate] API error:', response.status, errorText);
      }
    } catch (err) {
      console.error('[PaymentGate] Error detecting price:', err);
      setPriceDisplay('$14.99'); // Fallback to USD
    }
  };

  useEffect(() => {
    if (teacher && !teacher.has_paid) {
      console.log('[PaymentGate] Teacher loaded, detecting price...');
      detectPrice();
    }
  }, [teacher]);

  if (!teacher || teacher.has_paid) {
    return null;
  }

  return (
    <>
      <div className="rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border-2 border-brand-red/20 shadow-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
              You're Almost There!
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              We've found <span className="font-bold text-brand-red">2 potential matches</span> for your profile.
              Unlock full access to see school details and apply.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                'View matched school names',
                'See full salary details',
                'Access contact information',
                'Submit applications',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-red hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Unlock Matches for {priceDisplay}
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <span className="text-sm text-gray-500">One-time payment</span>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          window.location.reload();
        }}
      />
    </>
  );
}
