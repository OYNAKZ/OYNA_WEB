import { useState } from 'react';
import { Reservation } from '../data/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReservationCalendarProps {
  reservations: Reservation[];
}

export function ReservationCalendar({ reservations }: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getReservationsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reservations.filter((r) => r.startTime.startsWith(dateStr));
  };

  const today = new Date();

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayReservations = getReservationsForDay(day);
          const isToday =
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square border border-gray-800 rounded-lg p-2 hover:border-gray-600 transition-colors cursor-pointer ${
                isToday ? 'bg-blue-500/10 border-blue-500/30' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm mb-1 ${isToday ? 'text-blue-500 font-semibold' : 'text-gray-300'}`}>
                  {day}
                </div>
                {dayReservations.length > 0 && (
                  <div className="flex-1 flex flex-col gap-1">
                    {dayReservations.slice(0, 2).map((res, idx) => (
                      <div key={idx} className="text-xs px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded truncate">
                        {res.pcName}
                      </div>
                    ))}
                    {dayReservations.length > 2 && <div className="text-xs text-gray-500">+{dayReservations.length - 2} more</div>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
