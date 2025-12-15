'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AssignCourseFormProps {
  courseId: string;
  companyId: string;
  groups: { id: string; name: string }[];
  availableMembers: { id: string; email: string; full_name: string | null }[];
}

export function AssignCourseForm({
  courseId,
  companyId,
  groups,
  availableMembers,
}: AssignCourseFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [assignType, setAssignType] = useState<'users' | 'group'>('users');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        courseId,
        companyId,
        assignType,
        userIds: assignType === 'users' ? selectedUsers : undefined,
        groupId: assignType === 'group' ? selectedGroup : undefined,
      };

      const res = await fetch('/api/company-admin/courses/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requires_setup_fee) {
          // Redirect to setup fee page
          router.push('/company-admin/setup-fee');
          return;
        }
        throw new Error(data.error || 'Failed to assign course');
      }

      setSuccess(data.message || 'Course assigned successfully');
      setSelectedUsers([]);
      setSelectedGroup('');

      // Refresh the page to show new enrollments
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === availableMembers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableMembers.map((m) => m.id));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
      >
        Assign Course
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Assign Course</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>
                )}

                {/* Assignment Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignType('users')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        assignType === 'users'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Individual Users
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignType('group')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        assignType === 'group'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Group
                    </button>
                  </div>
                </div>

                {assignType === 'users' ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Users ({selectedUsers.length} selected)
                      </label>
                      {availableMembers.length > 0 && (
                        <button
                          type="button"
                          onClick={selectAllUsers}
                          className="text-sm text-primary-500 hover:text-primary-600"
                        >
                          {selectedUsers.length === availableMembers.length
                            ? 'Deselect All'
                            : 'Select All'}
                        </button>
                      )}
                    </div>
                    {availableMembers.length > 0 ? (
                      <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                        {availableMembers.map((member) => (
                          <label
                            key={member.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(member.id)}
                              onChange={() => toggleUser(member.id)}
                              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {member.full_name || 'No name'}
                              </p>
                              <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                        <p className="text-sm">All team members are already enrolled.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Group
                    </label>
                    {groups.length > 0 ? (
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="">Choose a group</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                        <p className="text-sm">No groups created yet.</p>
                        <a
                          href="/company-admin/groups"
                          className="text-sm text-primary-500 hover:text-primary-600"
                        >
                          Create a group
                        </a>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      All members in the selected group will be enrolled.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (assignType === 'users' && selectedUsers.length === 0) ||
                    (assignType === 'group' && !selectedGroup)
                  }
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
