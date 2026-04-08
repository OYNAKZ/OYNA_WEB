import { useState } from 'react';
import { Search, MoreVertical, Power, Ban } from 'lucide-react';
import { Badge } from './ui/badge';
import type { LivePC } from '../types/live';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PCTableProps {
  pcs: LivePC[];
  runningCommandFor?: string | null;
  onRunSystemAction?: (pcId: string, actionId: 'restart' | 'signOut') => void;
}

export function PCTable({ pcs, runningCommandFor = null, onRunSystemAction }: PCTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LivePC['status'] | 'all'>('all');

  const filteredPCs = pcs.filter((pc) => {
    const matchesSearch =
      pc.name.toLowerCase().includes(search.toLowerCase()) ||
      pc.user?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LivePC['status']) => {
    if (status === 'online') {
      return (
        <Badge className="border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
          Active
        </Badge>
      );
    }

    if (status === 'reserved') {
      return (
        <Badge className="border-[#FDE68A] bg-[#FEFCE8] text-[#854D0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#CA8A04]" />
          Reserved
        </Badge>
      );
    }

    return (
      <Badge className="border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
        Offline
      </Badge>
    );
  };

  const getTempColor = (temp: number) => {
    if (temp < 50) return 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]';
    if (temp < 65) return 'border-[#FDE68A] bg-[#FEFCE8] text-[#854D0E]';
    return 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search PCs or users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-[#D1D5DB] bg-white pl-10 pr-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'online', 'offline', 'reserved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]'
                    : 'border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">PC Name</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">User</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Session</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Temp</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Specs</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPCs.map((pc, index) => (
                <tr
                  key={pc.id}
                  className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors ${
                    index === filteredPCs.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <span className="font-medium text-[#111827]">{pc.name}</span>
                  </td>
                  <td className="py-2.5 px-4">{getStatusBadge(pc.status)}</td>
                  <td className="py-2.5 px-4 text-[#374151]">{pc.user || '-'}</td>
                  <td className="py-2.5 px-4 text-[#6B7280]">{pc.sessionTime || '-'}</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getTempColor(pc.temperature)}`}>
                      {pc.temperature} C
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-[#6B7280]">{pc.specs}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          disabled={runningCommandFor === pc.id}
                          className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#E5E7EB] text-[#111827]">
                        <DropdownMenuItem
                          onClick={() => onRunSystemAction?.(pc.id, 'restart')}
                          className="cursor-pointer focus:bg-[#F3F4F6]"
                        >
                          <Power className="w-4 h-4 mr-2 text-[#6B7280]" />
                          Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRunSystemAction?.(pc.id, 'signOut')}
                          className="cursor-pointer focus:bg-[#F3F4F6]"
                        >
                          <Ban className="w-4 h-4 mr-2 text-[#6B7280]" />
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

      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#6B7280]">
          Showing <span className="font-semibold text-[#111827]">{filteredPCs.length}</span> of{' '}
          <span className="font-semibold text-[#111827]">{pcs.length}</span> PCs
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F9FAFB] transition-colors">
            Previous
          </button>
          <button className="rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
            1
          </button>
          <button className="rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F9FAFB] transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
