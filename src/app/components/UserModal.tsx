import { User } from '../data/mockData';
import { DollarSign, Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface UserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function UserModal({ user, open, onClose }: UserModalProps) {
  if (!user) return null;

  const recentSessions = [
    { id: 1, pc: 'Gaming-01', date: '2026-03-14', duration: '2h 30m', cost: '$12.50' },
    { id: 2, pc: 'Gaming-05', date: '2026-03-12', duration: '1h 45m', cost: '$8.75' },
    { id: 3, pc: 'Standard-02', date: '2026-03-10', duration: '3h 15m', cost: '$13.00' },
    { id: 4, pc: 'Gaming-03', date: '2026-03-08', duration: '2h 00m', cost: '$10.00' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white text-[#111827]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] text-lg font-semibold text-[#1D4ED8] flex items-center justify-center">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-[#6B7280]">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-1 flex items-center gap-2 text-[#166534]">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Balance</span>
              </div>
              <p className="text-2xl font-semibold text-[#111827]">${user.balance.toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-1 flex items-center gap-2 text-[#1D4ED8]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Sessions</span>
              </div>
              <p className="text-2xl font-semibold text-[#111827]">{user.totalSessions}</p>
            </div>
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-1 flex items-center gap-2 text-[#4B5563]">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Total Hours</span>
              </div>
              <p className="text-2xl font-semibold text-[#111827]">{user.totalHours}h</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#111827]">Recent Sessions</h4>
            <div className="space-y-2">
              {recentSessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-center text-[#6B7280]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{session.pc}</p>
                      <p className="text-xs text-[#6B7280]">{session.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#111827]">{session.duration}</p>
                    <p className="text-xs text-[#6B7280]">{session.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 rounded-md border border-[#2563EB] bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors">
              Add Balance
            </button>
            <button className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
              View Full History
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
