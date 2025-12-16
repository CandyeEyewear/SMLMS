'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AssignToCompaniesModal } from './assign-to-companies-modal';

interface CourseActionsProps {
  courseId: string;
  courseName: string;
  isActive: boolean;
  hasEnrollments: boolean;
}

export function CourseActions({ courseId, courseName, isActive, hasEnrollments }: CourseActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/super-admin/courses/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update course');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/super-admin/courses/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete course');
      }

      setShowConfirm(false);
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <Link
            href={`/super-admin/courses/${courseId}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Details
          </Link>
          <Link
            href={`/super-admin/courses/${courseId}/edit`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit Course
          </Link>
          <Link
            href={`/super-admin/courses/${courseId}/modules`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Manage Modules
          </Link>
          <hr className="my-1" />
          <button
            onClick={() => {
              setShowAssignModal(true);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Assign to Companies
          </button>
          <hr className="my-1" />
          <button
            onClick={handleToggleActive}
            disabled={loading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {isActive ? 'Deactivate' : 'Activate'} Course
          </button>
          {!hasEnrollments ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete Course
            </button>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400">
              Cannot delete (has enrollments)
            </div>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-primary-900/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Course</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{courseName}</strong>?
              This will also delete all modules and lessons.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
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

      <AssignToCompaniesModal
        courseId={courseId}
        courseName={courseName}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
      />
    </div>
  );
}
