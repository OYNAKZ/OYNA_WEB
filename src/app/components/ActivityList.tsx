import { Activity } from '../data/mockData';
import { LogIn, LogOut, Calendar, CreditCard } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return LogIn;
      case 'logout':
        return LogOut;
      case 'reservation':
        return Calendar;
      case 'payment':
        return CreditCard;
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    if (type === 'login') return 'Login';
    if (type === 'logout') return 'Logout';
    if (type === 'reservation') return 'Reservation';
    return 'Payment';
  };

  return (
    <div className="divide-y divide-[#E5E7EB]">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors"
          >
            <div className="mt-0.5 h-7 w-7 rounded-md border border-[#E5E7EB] bg-white flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-[#6B7280]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#111827] leading-5">
                <span className="font-medium">{activity.user}</span> {activity.description}
              </p>
              <p className="mt-0.5 text-xs text-[#6B7280]">{getActivityLabel(activity.type)}</p>
            </div>

            <div className="text-xs text-[#6B7280] whitespace-nowrap">{activity.time}</div>
          </div>
        );
      })}
    </div>
  );
}
