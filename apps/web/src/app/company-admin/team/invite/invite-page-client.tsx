'use client';

import { useActionState, useMemo, useState } from 'react';
import type { BulkInviteState, InviteLinkState } from '../actions';

type Group = { id: string; name: string };

export function InvitePageClient({
  groups,
  bulkInviteAction,
  createInviteLinkAction,
}: {
  groups: Group[];
  bulkInviteAction: (prevState: BulkInviteState, formData: FormData) => Promise<BulkInviteState>;
  createInviteLinkAction: (prevState: InviteLinkState) => Promise<InviteLinkState>;
}) {
  const [csvText, setCsvText] = useState('email,full_name\n');

  const [bulkState, bulkFormAction, bulkPending] = useActionState<BulkInviteState, FormData>(
    bulkInviteAction,
    { ok: false }
  );

  const [linkState, linkFormAction, linkPending] = useActionState<InviteLinkState, FormData>(
    // Wrap to satisfy generic signature
    async (prev) => createInviteLinkAction(prev),
    { ok: false }
  );

  const stats = useMemo(() => {
    const results = bulkState.results || [];
    const ok = results.filter((r) => r.ok).length;
    return { total: results.length, ok, failed: results.length - ok };
  }, [bulkState.results]);

  return (
    <div className="space-y-8">
      {/* Bulk invite */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Bulk invite via CSV</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload a CSV (or paste content). Format: <code className="font-mono">email,full_name</code>
        </p>

        {bulkState.error ? (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{bulkState.error}</div>
        ) : null}

        <form action={bulkFormAction} className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-gray-700">CSV file</label>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                setCsvText(text);
              }}
              className="text-sm text-gray-600"
            />
          </div>

          <div>
            <label htmlFor="csv" className="block text-sm font-medium text-gray-700 mb-1">
              CSV content
            </label>
            <textarea
              id="csv"
              name="csv"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4490] focus:border-transparent outline-none transition-colors font-mono text-sm"
            />
          </div>

          {groups.length > 0 ? (
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Assign to groups (optional)</p>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {groups.map((g) => (
                  <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="groupIds"
                      value={g.id}
                      className="rounded border-gray-300 text-[#1A4490] focus:ring-[#1A4490]"
                    />
                    <span className="text-sm text-gray-700">{g.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={bulkPending}
              className="bg-[#1A4490] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#153670] transition-colors disabled:opacity-50"
            >
              {bulkPending ? 'Inviting...' : 'Send Invites'}
            </button>
            <a
              href="/company-admin/team"
              className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Back
            </a>
          </div>
        </form>

        {bulkState.ok && bulkState.results ? (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700">
                Results: <span className="font-medium">{stats.ok}</span> ok,{' '}
                <span className="font-medium">{stats.failed}</span> failed (total {stats.total})
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bulkState.results.map((r) => (
                    <tr key={r.email}>
                      <td className="px-4 py-2 text-sm text-gray-700">{r.email}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={r.ok ? 'text-green-700' : 'text-red-600'}>
                          {r.message}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      {/* Shareable invite link */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Shareable invite link</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate a link you can share. Anyone who signs up using the link will be attached to your company.
        </p>

        {linkState.error ? (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{linkState.error}</div>
        ) : null}

        <form action={linkFormAction} className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={linkPending}
            className="bg-[#2BB5C5] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#229aa8] transition-colors disabled:opacity-50"
          >
            {linkPending ? 'Generating...' : 'Generate Link'}
          </button>

          {linkState.ok && linkState.inviteUrl ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                readOnly
                value={linkState.inviteUrl}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(linkState.inviteUrl!);
                  } catch {
                    // ignore
                  }
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Copy
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
