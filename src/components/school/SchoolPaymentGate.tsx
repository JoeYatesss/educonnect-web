'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lock, Check, CreditCard, FileText, Users, Download, Sparkles } from 'lucide-react';

const BENEFITS = [
  { icon: Users, text: 'Access to all screened teacher profiles' },
  { icon: Download, text: 'Downloadable CVs and resumes' },
  { icon: Sparkles, text: 'Smart matching algorithm' },
  { icon: Check, text: 'Direct contact information' },
];

export default function SchoolPaymentGate() {
  const { schoolAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    companyName: '',
    billingAddress: '',
    additionalNotes: '',
  });

  // Don't show if already paid
  if (schoolAccount?.has_paid) {
    return null;
  }

  const handleStripePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { checkout_url } = await apiClient.createSchoolCheckoutSession({
        success_url: `${window.location.origin}/school-dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/school-dashboard?payment=cancelled`,
      });

      window.location.href = checkout_url;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to create payment session');
      setLoading(false);
    }
  };

  const handleInvoiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceLoading(true);
    setError(null);

    try {
      await apiClient.requestManualPayment({
        company_name: invoiceForm.companyName,
        billing_address: invoiceForm.billingAddress,
        additional_notes: invoiceForm.additionalNotes || undefined,
      });

      setInvoiceSuccess(true);
      setShowInvoiceForm(false);
    } catch (err: any) {
      console.error('Invoice request error:', err);
      setError(err.message || 'Failed to submit invoice request');
    } finally {
      setInvoiceLoading(false);
    }
  };

  if (invoiceSuccess) {
    return (
      <div className="mb-8 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-8 border border-green-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Invoice Request Submitted
            </h3>
            <p className="text-green-700">
              Our team will review your request and send an invoice to your email within 1-2 business days.
              You&apos;ll receive full access once payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 border border-blue-200 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Unlock Full Access</h3>
              <p className="text-gray-600">One-time payment for unlimited access</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Right: Payment Options */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">¥7,500</div>
              <p className="text-sm text-gray-500">One-time payment</p>
            </div>

            {!showInvoiceForm ? (
              <div className="space-y-3">
                <button
                  onClick={handleStripePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? 'Processing...' : 'Pay with Card'}
                </button>

                <button
                  onClick={() => setShowInvoiceForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <FileText className="w-5 h-5" />
                  Request Invoice
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvoiceRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.companyName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="School or Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={invoiceForm.billingAddress}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billingAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Full billing address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    value={invoiceForm.additionalNotes}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, additionalNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Any special requirements"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={invoiceLoading}
                    className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-brand-red hover:bg-red-600 disabled:opacity-50"
                  >
                    {invoiceLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
