import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { SeasonalPricing, PropertyStatus } from '../../types/stays';

interface AvailabilityCalendarProps {
  propertyId: string;
  seasonalPricing?: SeasonalPricing[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AvailabilityCalendar({ propertyId, seasonalPricing }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<{ date: number; status: PropertyStatus; season?: string }> = [];

    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null as any);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Mock availability status
      let status: PropertyStatus = 'available';
      const rand = Math.random();
      if (rand > 0.92) status = 'booked';
      else if (rand > 0.82) status = 'limited';

      // Check if in season
      const currentMonthNum = month + 1;
      const season = seasonalPricing?.find(s => {
        if (s.start_month <= s.end_month) {
          return currentMonthNum >= s.start_month && currentMonthNum <= s.end_month;
        } else {
          return currentMonthNum >= s.start_month || currentMonthNum <= s.end_month;
        }
      });

      days.push({ date: day, status, season: season?.label });
    }

    return days;
  }, [year, month, seasonalPricing]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30';
      case 'limited':
        return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30';
      case 'booked':
        return 'bg-red-500/20 text-red-400 cursor-not-allowed';
      default:
        return 'bg-white/5 text-gray-400';
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-white font-display text-lg">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-gray-500 text-xs uppercase py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => (
          <div key={idx} className="aspect-square">
            {day ? (
              <motion.button
                whileHover={day.status !== 'booked' ? { scale: 1.05 } : {}}
                className={`w-full h-full flex items-center justify-center text-sm transition-colors ${getStatusColor(day.status)}`}
                disabled={day.status === 'booked'}
              >
                {day.date}
              </motion.button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500/20" />
          <span className="text-gray-400 text-xs">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500/20" />
          <span className="text-gray-400 text-xs">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/20" />
          <span className="text-gray-400 text-xs">Booked</span>
        </div>
        {seasonalPricing && seasonalPricing.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Info className="w-4 h-4 text-luxury-gold" />
            <span className="text-luxury-gold text-xs">
              {seasonalPricing.length} seasonal rate{seasonalPricing.length > 1 ? 's' : ''} apply
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
