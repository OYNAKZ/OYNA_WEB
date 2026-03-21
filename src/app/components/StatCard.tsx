import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconColor?: string;
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="p-4 md:p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{title}</p>
        {Icon ? <Icon className="h-4 w-4 text-[#9CA3AF]" /> : null}
      </div>
      <p className="text-2xl font-semibold leading-none text-[#111827]">{value}</p>
      {trend ? (
        <p className={`mt-2 text-xs ${trend.positive ? 'text-[#166534]' : 'text-[#92400E]'}`}>
          {trend.value} vs last week
        </p>
      ) : null}
    </div>
  );
}
