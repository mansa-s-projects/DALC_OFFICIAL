import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Video, MapPin, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAvailableSlots } from '../../hooks/useConsultation';
import type { MeetingType, TimeSlot } from '../../types/business';

interface ConsultationSchedulerProps {
  serviceId: string;
  onSchedule: (params: {
    date: string;
    slot: TimeSlot;
    meetingType: MeetingType;
    agenda: string;
  }) => void;
  isLoading?: boolean;
}

const MEETING_OPTIONS: { type: MeetingType; label: string; icon: React.ReactNode }[] = [
  { type: 'online', label: 'Video Call', icon: <Video className="w-4 h-4" /> },
  { type: 'in_person', label: 'In Person', icon: <MapPin className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone Call', icon: <Phone className="w-4 h-4" /> },
];

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function ConsultationScheduler({
  serviceId,
  onSchedule,
  isLoading = false,
}: ConsultationSchedulerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(today, 1));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>('online');
  const [agenda, setAgenda] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const dateStr = getDateString(selectedDate);
  const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(serviceId, dateStr);

  // Build 5-day week view
  const weekStart = addDays(today, weekOffset * 5 + 1);
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const handleSubmit = () => {
    if (!selectedSlot) return;
    onSchedule({
      date: dateStr,
      slot: selectedSlot,
      meetingType,
      agenda,
    });
  };

  return (
    <div className="space-y-6">
      {/* Meeting type */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Meeting Format</p>
        <div className="grid grid-cols-3 gap-3">
          {MEETING_OPTIONS.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setMeetingType(type)}
              className={`flex flex-col items-center gap-2 py-3 px-2 border text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                meetingType === type
                  ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                  : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-xs uppercase tracking-widest">Select Date</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
              disabled={weekOffset === 0}
              className="p-1.5 text-gray-500 hover:text-luxury-gold disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="p-1.5 text-gray-500 hover:text-luxury-gold transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDays.map(day => {
            const ds = getDateString(day);
            const isSelected = ds === dateStr;
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = day.getDate();
            return (
              <button
                key={ds}
                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                className={`flex flex-col items-center py-3 border text-sm transition-all duration-300 ${
                  isSelected
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest mb-1">{dayName}</span>
                <span className="font-bold">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-luxury-gold/60" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Available Times (Dubai, GST)</p>
        </div>

        {slotsLoading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map(slot => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2.5 text-xs font-medium border transition-all duration-300 ${
                  !slot.available
                    ? 'border-white/5 text-gray-700 cursor-not-allowed'
                    : selectedSlot?.time === slot.time
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                    : 'border-white/10 text-gray-300 hover:border-luxury-gold/40 hover:text-luxury-gold'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}

        {!slotsLoading && slots.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4 italic">No slots available for this date.</p>
        )}
      </div>

      {/* Agenda */}
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">
          Agenda / Notes <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          value={agenda}
          onChange={e => setAgenda(e.target.value)}
          rows={3}
          placeholder="Describe what you'd like to discuss..."
          className="w-full bg-white/[0.03] border border-white/10 focus:border-luxury-gold/50 text-gray-300 placeholder-gray-600 text-sm p-3 outline-none resize-none transition-colors duration-300"
        />
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSubmit}
        disabled={!selectedSlot || isLoading}
        className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        {isLoading ? 'Scheduling…' : 'Confirm Consultation'}
      </motion.button>

      {selectedSlot && (
        <p className="text-center text-xs text-gray-500">
          {meetingType === 'online' ? 'A video link will be sent to your email.' : meetingType === 'phone' ? 'Our advisor will call you.' : 'Office address will be shared upon confirmation.'}
        </p>
      )}
    </div>
  );
}
