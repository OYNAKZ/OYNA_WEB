import { useState } from 'react';
import { users } from '../data/mockData';
import { UserModal } from '../components/UserModal';
import { Search, UserPlus } from 'lucide-react';
import type { User } from '../data/mockData';

export function Users() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Users</h2>
          <p className="text-sm text-[#6B7280]">Manage club members and account status</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

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
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Balance</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Sessions</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Hours</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Joined</th>
              </tr>
            </thead>
            <tbody>
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
                        {user.avatar}
                      </div>
                      <span className="font-medium text-[#111827]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#374151]">{user.email}</td>
                  <td className="px-4 py-2.5 font-medium text-[#166534]">${user.balance.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[#374151]">{user.totalSessions}</td>
                  <td className="px-4 py-2.5 text-[#374151]">{user.totalHours}h</td>
                  <td className="px-4 py-2.5 text-[#6B7280]">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
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
