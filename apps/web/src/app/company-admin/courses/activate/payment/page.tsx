'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CourseActivationPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activationId = searchParams.get('activation_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (activationId) {
      initiatePayment();
    } else {
      setError('Activation ID is required');
      setLoading(false);
    }
  }, [activationId]);

  const initiatePayment = async () => {
    try {
      const response = await fetch('/api/payments/create-course-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseActivationId: activationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      setPaymentData(data);

      // Auto-submit payment form
      if (data.payment_url && data.form_data) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;

        Object.entries(data.form_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <p>Redirecting to payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
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

  return null;
}



