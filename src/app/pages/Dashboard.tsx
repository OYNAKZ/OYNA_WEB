import { Monitor, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { PCStatusGrid } from '../components/PCStatusGrid';
import { ActivityList } from '../components/ActivityList';
import { pcs, activities } from '../data/mockData';

export function Dashboard() {
  const activePCs = pcs.filter((pc) => pc.status === 'online').length;
  const reservedPCs = pcs.filter((pc) => pc.status === 'reserved').length;
  const onlineUsers = pcs.filter((pc) => pc.user).length;

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-indigo-200 mb-2">OYNA Overview</div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Admin!</h2>
            <p className="text-indigo-100">Your club is performing great today with {activePCs} active stations</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
              <div className="text-xs text-indigo-200 mb-1">Total Revenue Today</div>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                $847
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active PCs"
          value={activePCs}
          icon={Monitor}
          trend={{ value: '+12%', positive: true }}
          iconColor="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Reserved PCs"
          value={reservedPCs}
          icon={Monitor}
          trend={{ value: '+5%', positive: true }}
          iconColor="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Revenue Today"
          value="$847"
          icon={DollarSign}
          trend={{ value: '+23%', positive: true }}
          iconColor="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Online Users"
          value={onlineUsers}
          icon={Users}
          trend={{ value: '-3%', positive: false }}
          iconColor="from-orange-500 to-amber-600"
        />
      </div>

      <div className="bg-gradient-to-br from-[#1a1a24] to-[#1f1f2e] border border-[#27273a]/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live PC Status</h2>
              <p className="text-xs text-gray-500">Real-time monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              <span className="text-gray-400">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
              <span className="text-gray-400">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full" />
              <span className="text-gray-400">Offline</span>
            </div>
          </div>
        </div>
        <PCStatusGrid pcs={pcs} />
      </div>

      <div className="bg-gradient-to-br from-[#1a1a24] to-[#1f1f2e] border border-[#27273a]/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <p className="text-xs text-gray-500">Latest user actions</p>
          </div>
        </div>
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}
