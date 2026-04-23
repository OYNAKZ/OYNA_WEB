import { useState } from 'react';
import { UserModal } from '../components/UserModal';
import { Search, UserPlus } from 'lucide-react';
import { useEffect } from 'react';

import { ApiError, backendApi } from '../lib/apiClient';
import type { BackendUser } from '../types/backend';

const toUserModalData = (user: BackendUser) => {
  const displayName = user.full_name?.trim() || `User #${user.id}`;
  const avatar = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    role: user.role,
    clubId: user.club_id,
    isActive: user.is_active,
    avatar: avatar || 'U',
  };
};

export function Users() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<ReturnType<typeof toUserModalData> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void backendApi
      .getUsers()
      .then((items) => {
        if (!cancelled) {
          setUsers(items);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load users');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter(user =>
    (user.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserClick = (user: BackendUser) => {
    setSelectedUser(toUserModalData(user));
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Users</h2>
          <p className="text-sm text-[#6B7280]">Backend-backed admin user directory</p>
        </div>
        <button disabled className="inline-flex items-center gap-2 rounded-md border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-sm font-medium text-white opacity-60">
          <UserPlus className="w-4 h-4" />
          Managed In Backend
        </button>
      </div>

      {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}

      <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#D1D5DB] bg-white pl-10 pr-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
          />
        </div>
      </div>

      <div className="rounded-md border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">User</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Email</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Role</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Club</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-[#6B7280]" colSpan={5}>Loading users...</td>
                </tr>
              ) : null}
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`cursor-pointer border-b border-[#E5E7EB] hover:bg-[#F9FAFB] ${
                    index === filteredUsers.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8] flex items-center justify-center">
                        {toUserModalData(user).avatar}
                      </div>
                      <span className="font-medium text-[#111827]">{user.full_name || `User #${user.id}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#374151]">{user.email}</td>
                  <td className="px-4 py-2.5 text-[#374151] capitalize">{user.role.replaceAll('_', ' ')}</td>
                  <td className="px-4 py-2.5 text-[#374151]">{user.club_id ? `Club #${user.club_id}` : '-'}</td>
                  <td className="px-4 py-2.5 text-[#6B7280]">{user.is_active ? 'Active' : 'Disabled'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-[#6B7280]">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      <UserModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
