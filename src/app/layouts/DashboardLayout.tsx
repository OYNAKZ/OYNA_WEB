import { Link, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Monitor, Calendar, Users, CreditCard, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'PC Management', href: '/pcs', icon: Monitor },
  { name: 'Reservations', href: '/reservations', icon: Calendar },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Payments', href: '/payments', icon: CreditCard },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPage = navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard';
  const displayName = user?.full_name?.trim() || user?.email || 'Admin User';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <aside className="border-b border-[#E5E7EB] bg-[#1F2937] md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r md:border-[#374151] md:flex md:flex-col">
        <div className="h-14 flex items-center px-4 md:px-5 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center text-xs font-bold text-white">OY</div>
            <div>
              <span className="font-semibold text-sm text-white">OYNA Admin</span>
              <p className="text-[11px] text-[#9CA3AF]">Operations</p>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-1 md:flex-col md:overflow-visible md:py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex min-w-fit items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#374151] text-white' : 'text-[#D1D5DB] hover:bg-[#2B3645] hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-[#374151]">
          <div className="rounded-md bg-[#2B3645] px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2563EB] rounded-md flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-[#9CA3AF] truncate">{user?.email || 'admin@oyna.local'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#475569] px-3 py-2 text-xs font-medium text-[#E2E8F0] transition hover:bg-[#374151]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[#111827]">{currentPage}</h1>
              <p className="text-xs text-[#6B7280]">Operational control panel</p>
            </div>
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#374151]">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
