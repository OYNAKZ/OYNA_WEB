import { PC } from '../data/mockData';

interface PCStatusGridProps {
  pcs: PC[];
}

export function PCStatusGrid({ pcs }: PCStatusGridProps) {
  const getStatusMeta = (status: PC['status']) => {
    if (status === 'online') {
      return {
        label: 'Active',
        dot: 'bg-[#16A34A]',
        badge: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]',
      };
    }

    if (status === 'reserved') {
      return {
        label: 'Reserved',
        dot: 'bg-[#CA8A04]',
        badge: 'border-[#FDE68A] bg-[#FEFCE8] text-[#854D0E]',
      };
    }

    return {
      label: 'Offline',
      dot: 'bg-[#9CA3AF]',
      badge: 'border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]',
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">PC</th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">User</th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Session</th>
          </tr>
        </thead>
        <tbody>
          {pcs.map((pc) => {
            const status = getStatusMeta(pc.status);
            return (
              <tr key={pc.id} className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB]">
                <td className="px-4 py-2.5 font-medium text-[#111827]">{pc.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-xs font-medium ${status.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[#374151]">{pc.user || '-'}</td>
                <td className="px-4 py-2.5 text-[#6B7280]">{pc.sessionTime || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
