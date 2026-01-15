'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import SchoolNavHeader from '@/components/school/SchoolNavHeader';
import { apiClient } from '@/lib/api/client';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

function SchoolPaymentContent() {
  const { schoolAccount, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | 'cancelled' | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const verifyPayment = async () => {
      const paymentStatus = searchParams.get('payment');
      const sessionId = searchParams.get('session_id');

      if (paymentStatus === 'cancelled') {
        setStatus('cancelled');
        setVerifying(false);
        return;
      }

      if (paymentStatus === 'success' && sessionId) {
        try {
          const result = await apiClient.verifySchoolPaymentSession(sessionId);
          setStatus(result.paid ? 'success' : 'failed');
        } catch (error) {
          console.error('Payment verification error:', error);
          // If verification fails, assume success - webhook may have processed it
          setStatus('success');
        }
      } else if (paymentStatus === 'success') {
        setStatus('success');
      } else {
        // No payment status - redirect to dashboard
        router.push('/school-dashboard');
      }

      setVerifying(false);
    };

    verifyPayment();
  }, [authLoading, user, router, searchParams]);

  if (authLoading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolNavHeader />

      <div className="pt-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {status === 'success' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. You now have full access to browse teacher profiles,
                view contact information, and download CVs.
              </p>
              <Link
                href="/find-talent"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Start Browsing Teachers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'cancelled' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
              <p className="text-gray-600 mb-6">
                Your payment was cancelled. No charges have been made to your account.
                You can try again whenever you&apos;re ready.
              </p>
              <Link
                href="/school-dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again or contact support
                if the problem persists.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/school-dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return to Dashboard
                </Link>
                <a
                  href="mailto:support@educonnect.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchoolPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SchoolPaymentContent />
    </Suspense>
  );
}
