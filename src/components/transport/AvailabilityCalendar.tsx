import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check, X } from 'lucide-react';
import { getAvailableTimeSlots, checkAvailability } from '../../lib/transport';
import type { TransportService, TimeSlot } from '../../types/transport';

interface AvailabilityCalendarProps {
  service: TransportService;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export default function AvailabilityCalendar({
  service,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; reason?: string } | null>(null);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Fill in empty days at start
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Fill in actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      checkAvailability(service.id, selectedDate)
        .then((result) => {
          setAvailability(result);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Load time slots
      getAvailableTimeSlots(service.id, selectedDate.toISOString().split('T')[0])
        .then((slots) => {
          setTimeSlots(slots);
        });
    } else {
      setAvailability(null);
      setTimeSlots([]);
    }
  }, [selectedDate, service.id]);

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Can't book in the past
    if (date < today) return true;
    
    // Check advance booking requirement
    const minAdvance = new Date();
    minAdvance.setHours(minAdvance.getHours() + service.advance_booking_hours);
    if (date < minAdvance) return true;
    
    // Check available days
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (!service.available_days.includes(dayName)) return true;
    
    return false;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-display text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-luxury-gold" />
            Select Date
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 border border-white/20 text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white text-sm font-medium w-32 text-center">
              {monthLabel}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 border border-white/20 text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] text-gray-500 uppercase tracking-widest py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            const disabled = isDateDisabled(date);
            const selected = isDateSelected(date);

            return (
              <button
                key={idx}
                disabled={disabled || !date}
                onClick={() => date && onDateSelect(date)}
                className={`
                  aspect-square flex items-center justify-center text-sm transition-all duration-200
                  ${!date ? 'invisible' : ''}
                  ${disabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-300 hover:text-white'}
                  ${selected ? 'bg-luxury-gold text-luxury-black font-bold' : ''}
                  ${!disabled && !selected ? 'hover:bg-white/10' : ''}
                `}
              >
                {date?.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-luxury-gold" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-white/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      {selectedDate && availability && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border ${
            availability.available
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <div className="flex items-center gap-2">
            {availability.available ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">Available on this date</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{availability.reason || 'Not available'}</span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Time Slots */}
      {selectedDate && timeSlots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 bg-white/[0.02] p-6"
        >
          <h3 className="text-white font-display text-lg flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-luxury-gold" />
            Select Time
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => onTimeSelect(slot.time)}
                className={`
                  py-2 px-3 text-xs border transition-all duration-200
                  ${selectedTime === slot.time
                    ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-bold'
                    : slot.available
                    ? 'border-white/20 text-gray-300 hover:border-luxury-gold/50 hover:text-luxury-gold'
                    : 'border-gray-800 text-gray-700 cursor-not-allowed'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Min hours notice */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" />
        Minimum booking: {service.min_booking_hours} hour{service.min_booking_hours > 1 ? 's' : ''}
        {service.advance_booking_hours > 0 && (
          <span className="ml-2">
            • Book at least {service.advance_booking_hours} hours in advance
          </span>
        )}
      </div>
    </div>
  );
}
