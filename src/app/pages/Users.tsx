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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Users</h2>
          <p className="text-gray-400">Manage club members and their accounts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-semibold">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{user.name}</h3>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="font-semibold text-green-500">${user.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                <p className="font-semibold">{user.totalSessions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Hours</p>
                <p className="font-semibold">{user.totalHours}h</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400">
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
