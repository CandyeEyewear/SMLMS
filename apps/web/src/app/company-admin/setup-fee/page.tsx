'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentButton } from '@/components/payments/payment-button';

interface Pricing {
  setup_fee: number;
  user_price_per_month: number;
  currency: string;
  is_custom: boolean;
}

export default function SetupFeePage() {
  const router = useRouter();
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupFeePaid, setSetupFeePaid] = useState(false);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      // Get user profile to get company_id
      const profileResponse = await fetch('/api/auth/me');
      const profileData = await profileResponse.json();
      
      if (!profileData.company_id) {
        setError('No company associated with your account');
        return;
      }

      const cId = profileData.company_id;
      setCompanyId(cId);

      // Check if setup fee is already paid
      const companyResponse = await fetch(`/api/company-admin/company-status?company_id=${cId}`);
      const companyData = await companyResponse.json();
      
      if (companyData.setup_fee_paid) {
        setSetupFeePaid(true);
        setLoading(false);
        return;
      }

      // Get pricing
      const pricingResponse = await fetch(`/api/payments/get-pricing?company_id=${cId}`);
      const pricingData = await pricingResponse.json();
      
      if (pricingData.success) {
        setPricing(pricingData.pricing);
      } else {
        setError(pricingData.error || 'Failed to load pricing');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load information');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/company-admin/courses');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (setupFeePaid) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Setup Fee Already Paid
            </h2>
            <p className="text-gray-600 mb-6">
              Your setup fee has been paid. You can now request courses.
            </p>
            <button
              onClick={() => router.push('/company-admin/courses')}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pricing || !companyId) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>{error || 'Failed to load pricing information'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Setup Fee Payment</h1>
          <p className="text-gray-600 mt-1">
            Pay the setup fee to start requesting courses for your company.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Setup Fee</span>
                <span className="text-lg font-semibold text-gray-900">
                  {pricing.currency} ${pricing.setup_fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="text-xl font-bold text-primary-500">
                  {pricing.currency} ${pricing.setup_fee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a one-time setup fee. After payment, you'll be able to
              request courses and add users to your company.
            </p>
          </div>

          <PaymentButton
            paymentType="setup_fee"
            companyId={companyId}
            amount={pricing.setup_fee}
            onSuccess={handlePaymentSuccess}
            className="w-full"
          >
            Pay {pricing.currency} ${pricing.setup_fee.toFixed(2)}
          </PaymentButton>
        </div>
      </div>
    </div>
  );
}



