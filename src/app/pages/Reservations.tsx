import { reservations } from '../data/mockData';
import { ReservationCalendar } from '../components/ReservationCalendar';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

export function Reservations() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/30">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30">Cancelled</Badge>;
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Reservations</h2>
          <p className="text-gray-400">Manage PC reservations and bookings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          <Calendar className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Calendar */}
      <ReservationCalendar reservations={reservations} />

      {/* Reservations Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="font-semibold">All Reservations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">PC</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const duration = (new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime()) / (1000 * 60 * 60);
                return (
                  <tr
                    key={reservation.id}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                      index === reservations.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium">{reservation.pcName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300">{reservation.userName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300">{formatDate(reservation.startTime)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Clock className="w-3 h-3" />
                        {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300">{duration}h</span>
                    </td>
                    <td className="py-4 px-6">
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
