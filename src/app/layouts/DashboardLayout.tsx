import { Link, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Monitor, Calendar, Users, CreditCard } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'PC Management', href: '/pcs', icon: Monitor },
  { name: 'Reservations', href: '/reservations', icon: Calendar },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Payments', href: '/payments', icon: CreditCard },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-[#171722] border-r border-[#2a2a3b] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2a2a3b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold">OY</div>
            <div>
              <span className="font-bold text-lg">OYNA</span>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#252538]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a3b]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#202031]">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@oyna.app</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="pl-64">
        <header className="h-16 bg-[#171722] border-b border-[#2a2a3b] flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold">
              {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">OYNA control panel</p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#202031] border border-[#2a2a3b]">
            <div className="text-sm font-medium text-gray-300">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
