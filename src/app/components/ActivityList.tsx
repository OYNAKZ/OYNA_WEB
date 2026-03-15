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

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return 'from-emerald-500 to-teal-600';
      case 'logout':
        return 'from-gray-500 to-gray-600';
      case 'reservation':
        return 'from-blue-500 to-indigo-600';
      case 'payment':
        return 'from-purple-500 to-pink-600';
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'logout':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'reservation':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'payment':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-2">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <div
            key={activity.id}
            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-[#27273a]/30 transition-all duration-200 border border-transparent hover:border-[#27273a]"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`} />
              {/* Icon container */}
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white">{activity.user}</p>
                <span className={`text-xs px-2 py-0.5 rounded-md border ${getActivityBadge(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
              <p className="text-sm text-gray-400">{activity.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-600 bg-[#27273a]/50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}