'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function CategoryRowActions({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/categories/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete category');
      }

      setShowConfirm(false);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/super-admin/categories/${categoryId}`}
          className="text-[#1A4490] hover:text-[#153670] font-medium text-sm"
        >
          Edit
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{categoryName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
