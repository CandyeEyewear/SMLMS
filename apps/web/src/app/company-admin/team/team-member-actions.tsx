'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TeamMemberActionsProps {
  memberId: string;
  memberEmail: string;
  currentUserId: string;
  memberRole: string;
}

export function TeamMemberActions({
  memberId,
  memberEmail,
  currentUserId,
  memberRole,
}: TeamMemberActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isCurrentUser = memberId === currentUserId;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/company-admin/remove-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove user');
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

  const handleRoleChange = async (newRole: 'user' | 'company_admin') => {
    setLoading(true);
    try {
      const response = await fetch('/api/company-admin/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update role');
      }

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
            href={`/company-admin/team/${memberId}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Profile
          </Link>
          <Link
            href={`/company-admin/team/${memberId}/courses`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Manage Courses
          </Link>

          {!isCurrentUser && (
            <>
              <hr className="my-1" />
              {memberRole === 'user' ? (
                <button
                  onClick={() => handleRoleChange('company_admin')}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Make Admin
                </button>
              ) : (
                <button
                  onClick={() => handleRoleChange('user')}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Remove Admin Rights
                </button>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Remove from Team
              </button>
            </>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Team Member</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove <strong>{memberEmail}</strong> from your team?
              This will revoke their access to all company courses.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
