import { User } from '../data/mockData';
import { X, DollarSign, Clock, Calendar } from 'lucide-react';
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
      <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Details</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-semibold">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Balance</span>
              </div>
              <p className="text-2xl font-semibold">${user.balance.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Sessions</span>
              </div>
              <p className="text-2xl font-semibold">{user.totalSessions}</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Total Hours</span>
              </div>
              <p className="text-2xl font-semibold">{user.totalHours}h</p>
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h4 className="font-semibold mb-3">Recent Sessions</h4>
            <div className="space-y-2">
              {recentSessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{session.pc}</p>
                      <p className="text-sm text-gray-400">{session.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{session.duration}</p>
                    <p className="text-sm text-gray-400">{session.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Add Balance
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              View Full History
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
