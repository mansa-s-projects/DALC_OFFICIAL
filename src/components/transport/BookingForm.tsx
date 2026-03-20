import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import type { TransportService, TransportBookingInput } from '../../types/transport';
import { PRICING_MODEL_LABELS } from '../../types/transport';
import AvailabilityCalendar from './AvailabilityCalendar';

interface BookingFormProps {
  service: TransportService;
  userId: string;
  onSubmit: (data: TransportBookingInput) => Promise<void>;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

export default function BookingForm({
  service,
  userId,
  onSubmit,
  isSubmitting,
  submitSuccess,
}: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState(service.pickup_locations[0] || '');
  const [customLocation, setCustomLocation] = useState('');
  const [duration, setDuration] = useState(service.min_booking_hours);
  const [specialRequests, setSpecialRequests] = useState('');

  const useCustomLocation = !service.pickup_locations.includes(pickupLocation);

  const calculatePrice = (): number | null => {
    if (!service.price_from) return null;
    
    switch (service.pricing_model) {
      case 'hourly':
        return service.price_from * duration;
      case 'daily':
        return service.price_from * Math.ceil(duration / 24);
      case 'fixed':
      case 'per_trip':
        return service.price_from;
      default:
        return null;
    }
  };

  const estimatedPrice = calculatePrice();

  const canSubmit = selectedDate && selectedTime && (pickupLocation || customLocation) && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Combine date and time
    // Parse time directly from ISO string to avoid timezone offset issues
    const pickupDateTime = new Date(selectedDate);
    const timeMatch = selectedTime.match(/T(\d{2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      pickupDateTime.setHours(hours, minutes, 0, 0);
    }

    // Calculate return date for hourly bookings
    let returnDateTime: Date | undefined;
    if (service.pricing_model === 'hourly') {
      returnDateTime = new Date(pickupDateTime);
      returnDateTime.setHours(returnDateTime.getHours() + duration);
    }

    const location = useCustomLocation ? customLocation : pickupLocation;

    await onSubmit({
      service_id: service.id,
      user_id: userId,
      pickup_date: pickupDateTime.toISOString(),
      return_date: returnDateTime?.toISOString(),
      pickup_location: location,
      duration_hours: duration,
      quoted_price: estimatedPrice || undefined,
      special_requests: specialRequests || undefined,
    });
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-emerald-500/30 bg-emerald-500/5 p-8 text-center"
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-white font-display text-xl mb-2">Booking Request Received</h3>
        <p className="text-gray-400 text-sm mb-4">
          We\'ve received your request and will confirm availability within 2 hours.
        </p>
        <p className="text-gray-500 text-xs">
          Reference: {service.name}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Price Summary */}
      <div className="border border-luxury-gold/30 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            {PRICING_MODEL_LABELS[service.pricing_model]}
          </span>
          {service.max_capacity && (
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              Up to {service.max_capacity} guests
            </span>
          )}
        </div>
        <p className="text-luxury-gold font-display text-3xl font-bold">
          {service.price_display || `AED ${service.price_from?.toLocaleString()}`}
        </p>
        {service.pricing_model === 'hourly' && (
          <p className="text-gray-500 text-xs mt-1">per hour</p>
        )}
      </div>

      {/* Calendar Selection */}
      <AvailabilityCalendar
        service={service}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={setSelectedDate}
        onTimeSelect={setSelectedTime}
      />

      {/* Duration (for hourly bookings) */}
      {service.pricing_model === 'hourly' && (
        <div className="border border-white/10 bg-white/[0.02] p-6">
          <label className="block text-white font-display text-base mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-luxury-gold" />
            Duration
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDuration(Math.max(service.min_booking_hours, duration - 1))}
              className="w-10 h-10 border border-white/20 text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors"
            >
              -
            </button>
            <span className="text-white text-lg font-medium w-20 text-center">
              {duration} hour{duration > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => setDuration(duration + 1)}
              className="w-10 h-10 border border-white/20 text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Pickup Location */}
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-white font-display text-base mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-luxury-gold" />
          Pickup Location
        </label>
        
        {service.pickup_locations.length > 0 && (
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm py-3 px-4 outline-none focus:border-luxury-gold/50 transition-colors mb-3"
          >
            {service.pickup_locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
            <option value="custom">Other location</option>
          </select>
        )}
        
        {(useCustomLocation || service.pickup_locations.length === 0) && (
          <input
            type="text"
            placeholder="Enter your pickup address"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm py-3 px-4 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600"
          />
        )}
      </div>

      {/* Special Requests */}
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-white font-display text-base mb-4">
          Special Requests
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requirements or preferences..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm py-3 px-4 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600 resize-none"
        />
      </div>

      {/* Price Estimate */}
      {estimatedPrice && service.pricing_model === 'hourly' && (
        <div className="flex items-center justify-between py-3 border-t border-white/10">
          <span className="text-gray-400 text-sm">Estimated Total</span>
          <span className="text-luxury-gold font-bold text-lg">
            AED {estimatedPrice.toLocaleString()}
          </span>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileHover={canSubmit ? { scale: 1.01 } : {}}
        whileTap={canSubmit ? { scale: 0.99 } : {}}
        className={`
          w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300
          flex items-center justify-center gap-2
          ${canSubmit
            ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
            : 'bg-white/10 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Request Booking
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      {!canSubmit && (!selectedDate || !selectedTime) && (
        <p className="text-gray-500 text-xs text-center">
          Please select a date and time to continue
        </p>
      )}
    </form>
  );
}
