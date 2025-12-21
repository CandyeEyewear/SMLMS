'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const router = useRouter();

  const updateMenuPosition = () => {
    const buttonEl = buttonRef.current;
    const menuEl = menuRef.current;
    if (!buttonEl || !menuEl) return;

    const rect = buttonEl.getBoundingClientRect();
    const menuWidth = menuEl.offsetWidth || 0;
    const menuHeight = menuEl.offsetHeight || 0;

    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prefer below-right aligned with the trigger
    let top = rect.bottom + padding;
    let left = rect.right - menuWidth;

    // Clamp horizontally into viewport
    left = Math.min(Math.max(left, padding), Math.max(padding, viewportWidth - menuWidth - padding));

    // If it would go off-screen, flip above
    if (top + menuHeight > viewportHeight - padding) {
      top = rect.top - menuHeight - padding;
    }
    top = Math.min(Math.max(top, padding), Math.max(padding, viewportHeight - menuHeight - padding));

    setMenuPosition({ top, left });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInTrigger = dropdownRef.current?.contains(target);
      const clickedInMenu = menuRef.current?.contains(target);
      if (!clickedInTrigger && !clickedInMenu) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Position after it mounts
    const raf = requestAnimationFrame(updateMenuPosition);

    // Reposition on scroll/resize (capture scroll to catch nested scrollers)
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

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

  const menu =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[1000] max-h-[70vh] overflow-y-auto"
            role="menu"
            aria-label="Course actions"
          >
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
              role="menuitem"
            >
              Assign to Companies
            </button>
            <hr className="my-1" />
            <button
              onClick={handleToggleActive}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              role="menuitem"
            >
              {isActive ? 'Deactivate' : 'Activate'} Course
            </button>
            {!hasEnrollments ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                Delete Course
              </button>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400" role="menuitem">
                Cannot delete (has enrollments)
              </div>
            )}
          </div>,
          document.body
        )
      : null;

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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {menu}

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
