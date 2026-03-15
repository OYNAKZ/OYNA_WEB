import { useState } from 'react';
import { PC } from '../data/mockData';
import { Search, MoreVertical, Power, Ban } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PCTableProps {
  pcs: PC[];
}

export function PCTable({ pcs }: PCTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PC['status'] | 'all'>('all');

  const filteredPCs = pcs.filter((pc) => {
    const matchesSearch =
      pc.name.toLowerCase().includes(search.toLowerCase()) ||
      pc.user?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PC['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Online</Badge>;
      case 'offline':
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/30">Offline</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Reserved</Badge>;
    }
  };

  const getTempColor = (temp: number) => {
    if (temp < 50) return 'text-emerald-400 bg-emerald-500/10';
    if (temp < 65) return 'text-amber-400 bg-amber-500/10';
    return 'text-rose-400 bg-rose-500/10';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search PCs or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#27273a] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'online', 'offline', 'reserved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-[#1a1a24] text-gray-400 hover:text-white hover:bg-[#27273a] border border-[#27273a]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1a1a24] to-[#1f1f2e] border border-[#27273a]/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27273a]/50 bg-[#1a1a24]/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">PC Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session Time</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specs</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPCs.map((pc, index) => (
                <tr
                  key={pc.id}
                  className={`border-b border-[#27273a]/30 hover:bg-[#27273a]/20 transition-colors group ${
                    index === filteredPCs.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <span className="font-semibold text-white">{pc.name}</span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(pc.status)}</td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{pc.user || <span className="text-gray-600">-</span>}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{pc.sessionTime || <span className="text-gray-600">-</span>}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold px-2.5 py-1 rounded-lg ${getTempColor(pc.temperature)}`}>
                      {pc.temperature} C
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-400">{pc.specs}</span>
                  </td>
                  <td className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-[#27273a] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a24] border-[#27273a]">
                        <DropdownMenuItem className="cursor-pointer hover:bg-[#27273a] focus:bg-[#27273a]">
                          <Power className="w-4 h-4 mr-2" />
                          Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-[#27273a] focus:bg-[#27273a]">
                          <Ban className="w-4 h-4 mr-2" />
                          Force Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">
          Showing <span className="font-semibold text-indigo-400">{filteredPCs.length}</span> of{' '}
          <span className="font-semibold text-white">{pcs.length}</span> PCs
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-sm bg-[#1a1a24] border border-[#27273a] text-gray-400 hover:text-white hover:bg-[#27273a] transition-all">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm bg-[#1a1a24] border border-[#27273a] text-gray-400 hover:text-white hover:bg-[#27273a] transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
