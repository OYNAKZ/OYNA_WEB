import { Mail, Shield, ActivitySquare, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface UserModalData {
  id: number;
  name: string;
  email: string;
  role: string;
  clubId: number | null;
  isActive: boolean;
  avatar: string;
}

interface UserModalProps {
  user: UserModalData | null;
  open: boolean;
  onClose: () => void;
}

export function UserModal({ user, open, onClose }: UserModalProps) {
  if (!user) return null;

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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-1 flex items-center gap-2 text-[#1D4ED8]">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">Role</span>
              </div>
              <p className="text-lg font-semibold capitalize text-[#111827]">{user.role.replaceAll('_', ' ')}</p>
            </div>
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-1 flex items-center gap-2 text-[#4B5563]">
                <ActivitySquare className="w-4 h-4" />
                <span className="text-xs font-medium">Status</span>
              </div>
              <p className="text-lg font-semibold text-[#111827]">{user.isActive ? 'Active' : 'Disabled'}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#111827]">Directory</h4>
            <div className="space-y-2">
              {[
                { id: 'email', icon: Mail, label: 'Email', value: user.email },
                { id: 'club', icon: Building2, label: 'Club ID', value: user.clubId ? `Club #${user.clubId}` : 'No club scope' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-center text-[#6B7280]">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                      <p className="text-xs text-[#6B7280]">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
