import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay, isBefore, startOfToday } from 'date-fns';
import { useAvailableSlots } from '../../hooks/useExperienceBooking';
import type { ExperienceService } from '../../types/experiences';

interface TimeSlotPickerProps {
  experience: ExperienceService;
  selectedDate: Date | null;
  selectedSlot: string | null;
  onDateChange: (date: Date) => void;
  onSlotChange: (slot: string) => void;
  partySize?: number;
}

export default function TimeSlotPicker({
  experience,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  partySize = 1,
}: TimeSlotPickerProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const { data: slots = [], isLoading } = useAvailableSlots(
    experience.id,
    selectedDate || new Date()
  );

  // Generate next 14 days
  const today = startOfToday();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + currentWeekOffset * 7));

  const handlePrevWeek = () => setCurrentWeekOffset(prev => Math.max(0, prev - 1));
  const handleNextWeek = () => setCurrentWeekOffset(prev => prev + 1);

  // Filter slots based on party size
  const availableSlots = slots.filter(
    slot => slot.available && (slot.remaining_capacity || 0) >= partySize
  );

  // Event-based experience
  if (experience.service_type === 'event' && experience.event_date) {
    const eventDate = new Date(experience.event_date);
    const isPast = isBefore(eventDate, today);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-luxury-gold">
          <Clock className="w-5 h-5" />
          <h3 className="font-display text-lg">Event Date & Time</h3>
        </div>

        <div className="border border-luxury-gold/30 bg-luxury-gold/5 p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">This is a special event on</p>
          <p className="text-white font-display text-2xl mb-1">
            {format(eventDate, 'EEEE, MMMM d, yyyy')}
          </p>
          {experience.time_slots[0] && (
            <p className="text-luxury-gold text-sm">
              {experience.time_slots[0].start} - {experience.time_slots[0].end}
            </p>
          )}
          {isPast && (
            <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> This event has already taken place
            </p>
          )}
        </div>

        {!isPast && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDateChange(eventDate)}
            className="w-full py-3 bg-luxury-gold text-luxury-black font-bold uppercase tracking-widest text-sm hover:bg-luxury-gold/90 transition-colors"
          >
            Select This Event
          </motion.button>
        )}
      </div>
    );
  }

  // On-demand experience (no time slots needed)
  if (experience.service_type === 'on_demand') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-luxury-gold">
          <Clock className="w-5 h-5" />
          <h3 className="font-display text-lg">Select Date</h3>
        </div>

        <p className="text-gray-400 text-sm">
          This experience is available on demand. Select your preferred date:
        </p>

        {/* Date selector (simplified) */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {days.slice(0, 7).map(day => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDisabled = isBefore(day, today);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                disabled={isDisabled}
                onClick={() => onDateChange(day)}
                className={`p-3 text-center border transition-all duration-300 ${
                  isSelected
                    ? 'border-luxury-gold bg-luxury-gold text-luxury-black'
                    : isDisabled
                    ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'border-white/10 hover:border-luxury-gold/50 text-white'
                }`}
              >
                <span className="block text-[10px] uppercase">{format(day, 'EEE')}</span>
                <span className="block text-lg font-bold">{format(day, 'd')}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-luxury-gold">
          <Clock className="w-5 h-5" />
          <h3 className="font-display text-lg">Select Date & Time</h3>
        </div>
        {partySize > 1 && (
          <p className="text-gray-400 text-xs">
            Showing availability for {partySize} guests
          </p>
        )}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevWeek}
          disabled={currentWeekOffset === 0}
          className="p-2 border border-white/10 text-gray-400 hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-400 text-sm">
          {format(days[0], 'MMM d')} - {format(days[6], 'MMM d')}
        </span>
        <button
          onClick={handleNextWeek}
          className="p-2 border border-white/10 text-gray-400 hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {days.slice(0, 7).map(day => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDisabled = isBefore(day, today);

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              disabled={isDisabled}
              onClick={() => onDateChange(day)}
              className={`p-2 text-center border transition-all duration-300 ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold text-luxury-black'
                  : isDisabled
                  ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                  : 'border-white/10 hover:border-luxury-gold/50 text-white'
              }`}
            >
              <span className="block text-[9px] uppercase">{format(day, 'EEE')}</span>
              <span className="block text-base font-bold">{format(day, 'd')}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-gray-400 text-sm">
              Available times for {format(selectedDate, 'EEEE, MMMM d')}:
            </p>

            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map(slot => {
                  const isSelected = selectedSlot === slot.time;

                  return (
                    <motion.button
                      key={slot.time}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSlotChange(slot.time)}
                      className={`relative py-3 px-4 border text-sm transition-all duration-300 ${
                        isSelected
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                          : 'border-white/10 hover:border-luxury-gold/50 text-white'
                      }`}
                    >
                      {isSelected && (
                        <Check className="absolute top-1 right-1 w-3 h-3 text-luxury-gold" />
                      )}
                      <span>{slot.label}</span>
                      {slot.remaining_capacity && slot.remaining_capacity < 10 && (
                        <span className="block text-[10px] text-amber-400 mt-0.5">
                          {slot.remaining_capacity} left
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-white/10">
                <p className="text-gray-500 text-sm">No available slots for this date</p>
                <p className="text-gray-600 text-xs mt-1">Try selecting a different date</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedDate && (
        <p className="text-gray-500 text-sm text-center py-4">
          Select a date to see available time slots
        </p>
      )}
    </div>
  );
}
