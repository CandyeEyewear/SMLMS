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

export default function UserSubscriptionPage() {
  const router = useRouter();
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(1);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [userCount, billingPeriod, pricing]);

  const fetchCompanyInfo = async () => {
    try {
      const profileResponse = await fetch('/api/auth/me');
      const profileData = await profileResponse.json();
      
      if (!profileData.company_id) {
        setError('No company associated with your account');
        return;
      }

      const cId = profileData.company_id;
      setCompanyId(cId);

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

  const calculateTotal = () => {
    if (!pricing) return;

    let months = 1;
    if (billingPeriod === 'quarterly') months = 3;
    else if (billingPeriod === 'annually') months = 12;

    const total = pricing.user_price_per_month * userCount * months;
    setTotalAmount(total);
  };

  const getBillingPeriodDates = () => {
    const start = new Date();
    const end = new Date();

    if (billingPeriod === 'monthly') {
      end.setMonth(end.getMonth() + 1);
    } else if (billingPeriod === 'quarterly') {
      end.setMonth(end.getMonth() + 3);
    } else if (billingPeriod === 'annually') {
      end.setFullYear(end.getFullYear() + 1);
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const handlePaymentSuccess = () => {
    router.push('/company-admin/team');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
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

  const billingDates = getBillingPeriodDates();

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Users Subscription</h1>
          <p className="text-gray-600 mt-1">
            Subscribe to add multiple users to your company at once.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Subscription Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Users
                </label>
                <input
                  type="number"
                  min="1"
                  value={userCount}
                  onChange={(e) => setUserCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Price per user per month: {pricing.currency} ${pricing.user_price_per_month.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Period
                </label>
                <select
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (3 months)</option>
                  <option value="annually">Annually (12 months)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {userCount} user{userCount !== 1 ? 's' : ''} × {pricing.user_price_per_month.toFixed(2)}/{billingPeriod === 'monthly' ? 'month' : billingPeriod === 'quarterly' ? 'quarter' : 'year'}
                </span>
                <span className="text-gray-900">
                  {pricing.currency} ${(pricing.user_price_per_month * userCount * (billingPeriod === 'monthly' ? 1 : billingPeriod === 'quarterly' ? 3 : 12)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="text-xl font-bold text-primary-500">
                  {pricing.currency} ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a recurring subscription. After payment, you&apos;ll be able to
              add {userCount} user{userCount !== 1 ? 's' : ''} to your company. The subscription will
              automatically renew every {billingPeriod === 'monthly' ? 'month' : billingPeriod === 'quarterly' ? '3 months' : 'year'}.
            </p>
          </div>

          <PaymentButton
            paymentType="user_subscription"
            companyId={companyId}
            amount={totalAmount}
            userCount={userCount}
            billingPeriodStart={billingDates.start}
            billingPeriodEnd={billingDates.end}
            onSuccess={handlePaymentSuccess}
            className="w-full"
          >
            Subscribe for {pricing.currency} ${totalAmount.toFixed(2)}
          </PaymentButton>
        </div>
      </div>
    </div>
  );
}



