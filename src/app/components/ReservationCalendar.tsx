import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReservationCalendarProps {
  reservations: Array<{
    id: string | number;
    pcName: string;
    startTime: string;
  }>;
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
    <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111827]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={previousMonth} className="rounded-md border border-[#D1D5DB] p-1.5 text-[#4B5563] hover:bg-[#F9FAFB] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="rounded-md border border-[#D1D5DB] p-1.5 text-[#4B5563] hover:bg-[#F9FAFB] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
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
              className={`aspect-square rounded-md border p-2 transition-colors cursor-pointer ${
                isToday ? 'border-[#BFDBFE] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`mb-1 text-xs ${isToday ? 'text-[#1D4ED8] font-semibold' : 'text-[#374151]'}`}>
                  {day}
                </div>
                {dayReservations.length > 0 && (
                  <div className="flex-1 flex flex-col gap-1">
                    {dayReservations.slice(0, 2).map((res, idx) => (
                      <div key={idx} className="truncate rounded border border-[#BFDBFE] bg-[#EFF6FF] px-1 py-0.5 text-[10px] text-[#1D4ED8]">
                        {res.pcName}
                      </div>
                    ))}
                    {dayReservations.length > 2 && <div className="text-[10px] text-[#6B7280]">+{dayReservations.length - 2} more</div>}
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
