'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  is_active: boolean;
}

interface AssignToCompaniesModalProps {
  courseId: string;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignToCompaniesModal({
  courseId,
  courseName,
  isOpen,
  onClose,
}: AssignToCompaniesModalProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [assignedCompanyIds, setAssignedCompanyIds] = useState<Set<string>>(new Set());
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchAssignedCompanies();
    }
  }, [isOpen, courseId]);

  const fetchCompanies = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/super-admin/companies/list');
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setFetching(false);
    }
  };

  const fetchAssignedCompanies = async () => {
    try {
      const res = await fetch(`/api/super-admin/courses/${courseId}/assigned-companies`);
      if (!res.ok) throw new Error('Failed to fetch assigned companies');
      const data = await res.json();
      setAssignedCompanyIds(new Set(data.companyIds || []));
      setSelectedCompanyIds(new Set(data.companyIds || []));
    } catch (err) {
      console.error('Error fetching assigned companies:', err);
    }
  };

  const toggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Determine which companies to assign and unassign
      const toAssign: string[] = [];
      const toUnassign: string[] = [];

      // Companies that are selected but not currently assigned
      selectedCompanyIds.forEach((id) => {
        if (!assignedCompanyIds.has(id)) {
          toAssign.push(id);
        }
      });

      // Companies that are currently assigned but not selected
      assignedCompanyIds.forEach((id) => {
        if (!selectedCompanyIds.has(id)) {
          toUnassign.push(id);
        }
      });

      // Perform assignments
      if (toAssign.length > 0) {
        const assignRes = await fetch('/api/super-admin/courses/assign-to-companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            companyIds: toAssign,
            action: 'assign',
          }),
        });

        if (!assignRes.ok) {
          const data = await assignRes.json();
          throw new Error(data.error || 'Failed to assign course');
        }
      }

      // Perform unassignments
      if (toUnassign.length > 0) {
        const unassignRes = await fetch('/api/super-admin/courses/assign-to-companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            companyIds: toUnassign,
            action: 'unassign',
          }),
        });

        if (!unassignRes.ok) {
          const data = await unassignRes.json();
          throw new Error(data.error || 'Failed to unassign course');
        }
      }

      if (toAssign.length === 0 && toUnassign.length === 0) {
        setSuccess('No changes to save');
      } else {
        setSuccess('Course assignments updated successfully');
        // Refresh the assigned companies list
        await fetchAssignedCompanies();
        router.refresh();
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeCompanies = companies.filter((c) => c.is_active);

  return (
    <div className="fixed inset-0 bg-primary-900/35 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign Course to Companies
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select which companies should have access to <strong>{courseName}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {fetching ? (
            <div className="text-center py-8 text-gray-500">Loading companies...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <>
              {activeCompanies.length > 0 ? (
                <div className="space-y-2">
                  {activeCompanies.map((company) => {
                    const isSelected = selectedCompanyIds.has(company.id);
                    const wasAssigned = assignedCompanyIds.has(company.id);

                    return (
                      <label
                        key={company.id}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCompany(company.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {company.name}
                            </span>
                            {wasAssigned && !isSelected && (
                              <span className="text-xs text-orange-600 font-medium">
                                Will be removed
                              </span>
                            )}
                            {!wasAssigned && isSelected && (
                              <span className="text-xs text-green-600 font-medium">
                                Will be added
                              </span>
                            )}
                            {wasAssigned && isSelected && (
                              <span className="text-xs text-gray-500">
                                Currently assigned
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No active companies found
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || fetching}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

