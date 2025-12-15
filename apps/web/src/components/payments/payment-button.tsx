'use client';

import { useState } from 'react';

interface PaymentButtonProps {
  paymentType: 'setup_fee' | 'user_subscription';
  companyId: string;
  enrollmentId?: string;
  amount: number;
  userCount?: number;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PaymentButton({
  paymentType,
  companyId,
  enrollmentId,
  amount,
  userCount,
  billingPeriodStart,
  billingPeriodEnd,
  onSuccess,
  className = '',
  children,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType,
          companyId,
          enrollmentId,
          amount,
          userCount,
          billingPeriodStart,
          billingPeriodEnd,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment');
      }

      const data = await response.json();

      if (data.payment_url && data.form_data) {
        // EZEE requires a POST form submission with form data
        // Create a form and submit it programmatically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;
        
        // Add all form fields
        Object.entries(data.form_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        
        // Append form to body, submit, then remove
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        throw new Error('No payment URL or form data received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium ${className}`}
      >
        {loading ? 'Processing...' : children || `Pay JMD $${amount.toFixed(2)}`}
      </button>
    </div>
  );
}

