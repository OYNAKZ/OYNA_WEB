import { Monitor } from 'lucide-react';
import { PC } from '../data/mockData';

interface PCStatusGridProps {
  pcs: PC[];
}

export function PCStatusGrid({ pcs }: PCStatusGridProps) {
  const getStatusColor = (status: PC['status']) => {
    switch (status) {
      case 'online':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 hover:border-emerald-500/60';
      case 'offline':
        return 'from-gray-500/10 to-gray-600/10 border-gray-500/30 hover:border-gray-500/40';
      case 'reserved':
        return 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 hover:border-blue-500/60';
    }
  };

  const getStatusDot = (status: PC['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500 shadow-lg shadow-emerald-500/50';
      case 'offline':
        return 'bg-gray-500';
      case 'reserved':
        return 'bg-blue-500 shadow-lg shadow-blue-500/50';
    }
  };

  const getTextColor = (status: PC['status']) => {
    switch (status) {
      case 'online':
        return 'text-emerald-400';
      case 'offline':
        return 'text-gray-500';
      case 'reserved':
        return 'text-blue-400';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {pcs.map((pc) => (
        <div
          key={pc.id}
          className={`group relative bg-gradient-to-br ${getStatusColor(pc.status)} border rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300" />

          <div className="relative flex flex-col items-center gap-3">
            <div className="relative">
              {pc.status !== 'offline' && (
                <div className={`absolute inset-0 ${pc.status === 'online' ? 'bg-emerald-500' : 'bg-blue-500'} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              )}

              <div className="relative">
                <Monitor className={`w-9 h-9 ${getTextColor(pc.status)} group-hover:scale-110 transition-transform`} />
                <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${getStatusDot(pc.status)} rounded-full border-2 border-[#1a1a24] ${pc.status === 'online' ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className={`text-sm font-bold ${getTextColor(pc.status)}`}>{pc.name}</p>
              <div
                className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${
                  pc.status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : pc.status === 'reserved'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {pc.status === 'online' ? 'Live' : pc.status === 'reserved' ? 'Reserved' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
