import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconColor?: string;
}

export function StatCard({ title, value, icon: Icon, trend, iconColor = 'from-blue-500 to-blue-600' }: StatCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a24] to-[#1f1f2e] border border-[#27273a]/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-2xl" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2 font-medium">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent mb-3">{value}</p>
          {trend && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  trend.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                <span className="text-xs font-bold">
                  {trend.positive ? 'Up' : 'Down'} {trend.value}
                </span>
              </div>
              <span className="text-xs text-gray-600">vs last week</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${iconColor} rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
          <div className={`relative w-14 h-14 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
