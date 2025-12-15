'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CoursePricing {
  id?: string;
  course_id: string;
  course_title?: string;
  setup_fee: number;
  reactivation_fee: number;
  seat_fee: number;
  currency: string;
}

export default function PricingManagementPage() {
  const [courses, setCourses] = useState<CoursePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPricing, setEditingPricing] = useState<CoursePricing | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/super-admin/pricing/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: CoursePricing) => {
    setEditingId(course.course_id);
    setEditingPricing({ ...course });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingPricing(null);
  };

  const handleSave = async () => {
    if (!editingPricing) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/super-admin/pricing/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: editingPricing.course_id,
          setup_fee: editingPricing.setup_fee,
          reactivation_fee: editingPricing.reactivation_fee,
          seat_fee: editingPricing.seat_fee,
          currency: editingPricing.currency,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Pricing updated successfully');
        await fetchCourses();
        handleCancel();
      } else {
        setError(data.error || 'Failed to update pricing');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Pricing</h1>
        <p className="text-gray-600 mt-1">
          Set pricing for each course. Companies can activate courses with these prices.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setup Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reactivation Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No courses found. Create courses first.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-gray-50">
                    {editingId === course.course_id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.course_title || 'Unknown Course'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPricing?.setup_fee || 0}
                            onChange={(e) =>
                              setEditingPricing({
                                ...editingPricing!,
                                setup_fee: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPricing?.reactivation_fee || 0}
                            onChange={(e) =>
                              setEditingPricing({
                                ...editingPricing!,
                                reactivation_fee: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPricing?.seat_fee || 0}
                            onChange={(e) =>
                              setEditingPricing({
                                ...editingPricing!,
                                seat_fee: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editingPricing?.currency || 'USD'}
                            onChange={(e) =>
                              setEditingPricing({
                                ...editingPricing!,
                                currency: e.target.value,
                              })
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="USD">USD</option>
                            <option value="JMD">JMD</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="text-primary-500 hover:text-primary-600 mr-3 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.course_title || 'Unknown Course'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.currency} ${course.setup_fee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.currency} ${course.reactivation_fee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.currency} ${course.seat_fee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-primary-500 hover:text-primary-600"
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
