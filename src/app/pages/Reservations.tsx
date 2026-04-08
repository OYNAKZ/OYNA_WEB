import { reservations } from '../data/mockData';
import { ReservationCalendar } from '../components/ReservationCalendar';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';


export function Reservations() {
  const[openModal, setOpenModal] = useState(0)

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]">Active</Badge>;
    if (status === 'upcoming') return <Badge className="border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]">Upcoming</Badge>;
    if (status === 'cancelled') return <Badge className="border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]">Cancelled</Badge>;
    return <Badge className="border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]">Completed</Badge>;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-5">
      <div className='abosulte'>
        {openModal ? <div></div> : <div>None</div>}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Reservations</h2>
          <p className="text-sm text-[#6B7280]">Manage PC reservations and bookings</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors">
          <Calendar className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      <ReservationCalendar reservations={reservations} />

      <div className="rounded-md border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#111827]">All Reservations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">PC</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">User</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Date</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Time</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Duration</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const duration = (new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime()) / (1000 * 60 * 60);
                return (
                  <tr
                    key={reservation.id}
                    className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors ${
                      index === reservations.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <span className="font-medium text-[#111827]">{reservation.pcName}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[#374151]">{reservation.userName}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[#374151]">{formatDate(reservation.startTime)}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1 text-[#6B7280]">
                        <Clock className="w-3 h-3" />
                        {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[#374151]">{duration}h</span>
                    </td>
                    <td className="py-2.5 px-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
