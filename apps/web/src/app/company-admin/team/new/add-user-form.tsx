'use client';

import { useActionState } from 'react';
import type { InviteUserState } from '../actions';

type Group = { id: string; name: string };

export function AddUserForm({
  groups,
  action,
}: {
  groups: Group[];
  action: (prevState: InviteUserState, formData: FormData) => Promise<InviteUserState>;
}) {
  const [state, formAction, pending] = useActionState<InviteUserState, FormData>(action, {
    ok: false,
  });

  return (
    <form action={formAction} className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {state.error ? (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{state.error}</div>
        ) : null}
        {state.ok && state.message ? (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{state.message}</div>
        ) : null}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4490] focus:border-transparent outline-none transition-colors"
            placeholder="user@company.com"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4490] focus:border-transparent outline-none transition-colors"
            placeholder="Jane Doe"
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
        ) : (
          <div className="text-sm text-gray-500">
            You don’t have any groups yet. Create a group first if you want to auto-assign users.
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#1A4490] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#153670] transition-colors disabled:opacity-50"
        >
          {pending ? 'Sending...' : 'Send Invite'}
        </button>
        <a
          href="/company-admin/team"
          className="px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
