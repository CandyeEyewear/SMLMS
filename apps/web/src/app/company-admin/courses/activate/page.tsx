'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentButton } from '@/components/payments/payment-button';

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
}

interface Pricing {
  setupFee: number;
  reactivationFee: number;
  seatFee: number;
  currency: string;
}

interface ActivationInfo {
  isRenewal: boolean;
  isExpired: boolean;
  expiresAt?: string;
}

export default function ActivateCoursePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [activationInfo, setActivationInfo] = useState<ActivationInfo | null>(null);
  const [seatCount, setSeatCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyAndCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && companyId) {
      fetchPricingAndActivation();
    }
  }, [selectedCourse, companyId]);

  const fetchCompanyAndCourses = async () => {
    try {
      // Get user profile
      const profileResponse = await fetch('/api/auth/me');
      const profileData = await profileResponse.json();
      
      if (!profileData.company_id) {
        setError('No company associated with your account');
        return;
      }

      setCompanyId(profileData.company_id);

      // Get available courses for company
      const coursesResponse = await fetch(`/api/company-admin/courses/available?company_id=${profileData.company_id}`);
      const coursesData = await coursesResponse.json();
      
      if (coursesData.success) {
        setCourses(coursesData.courses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingAndActivation = async () => {
    if (!selectedCourse || !companyId) return;

    try {
      // Get pricing
      const pricingResponse = await fetch(
        `/api/payments/get-course-pricing?course_id=${selectedCourse.id}&company_id=${companyId}`
      );
      const pricingData = await pricingResponse.json();
      
      if (pricingData.success) {
        setPricing(pricingData.pricing);
      }

      // Check existing activation
      const activationResponse = await fetch(
        `/api/company-admin/courses/activation-status?course_id=${selectedCourse.id}&company_id=${companyId}`
      );
      const activationData = await activationResponse.json();
      
      if (activationData.success) {
        setActivationInfo(activationData);
      }
    } catch (err: any) {
      console.error('Error fetching pricing:', err);
    }
  };

  const handleActivate = async () => {
    if (!selectedCourse || !pricing || seatCount < 1) return;

    setActivating(true);
    setError(null);

    try {
      // Create course activation
      const response = await fetch('/api/company-admin/courses/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          seatCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to activate course');
      }

      // Redirect to payment
      router.push(`/company-admin/courses/activate/payment?activation_id=${data.activation.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to activate course');
    } finally {
      setActivating(false);
    }
  };

  const calculateTotal = () => {
    if (!pricing) return 0;
    const fee = activationInfo?.isRenewal ? pricing.reactivationFee : pricing.setupFee;
    return fee + pricing.seatFee * seatCount;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error && !selectedCourse) {
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

  if (!selectedCourse) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activate Course</h1>
          <p className="text-gray-600 mt-1">
            Select a course to activate for your company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              {course.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-primary-500 hover:text-primary-600 mb-4"
          >
            ← Back to course selection
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.title}</h1>
          {activationInfo?.isRenewal && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {activationInfo.isExpired
                  ? 'This course has expired. Renew to restore access.'
                  : 'You have an existing activation. This will be a renewal.'}
              </p>
            </div>
          )}
        </div>

        {pricing && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Activation Details
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each seat provides 12 months of access to this course
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pricing Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {activationInfo?.isRenewal ? 'Reactivation Fee' : 'Setup Fee'}
                  </span>
                  <span className="text-gray-900">
                    {pricing.currency} ${(activationInfo?.isRenewal ? pricing.reactivationFee : pricing.setupFee).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {seatCount} Seat{seatCount !== 1 ? 's' : ''} × {pricing.currency} ${pricing.seatFee.toFixed(2)}
                  </span>
                  <span className="text-gray-900">
                    {pricing.currency} ${(pricing.seatFee * seatCount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-xl font-bold text-primary-500">
                    {pricing.currency} ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Course access is valid for 12 months from activation date.
                All seats will expire on the same date regardless of when users are added.
              </p>
            </div>

            <button
              onClick={handleActivate}
              disabled={activating || seatCount < 1}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {activating ? 'Creating Activation...' : 'Continue to Payment'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



