import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ChevronDown, Check, Loader2 } from 'lucide-react';
import type { StaysProperty } from '../../types/stays';
import { usePriceCalculation } from '../../hooks/useStaysBooking';
import { PRICING_MODEL_LABELS } from '../../types/stays';

interface PriceCalculatorProps {
  property: StaysProperty;
}

export default function PriceCalculator({ property }: PriceCalculatorProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Only fetch price when we have valid dates
  const shouldFetchPrice = checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
  
  const { data: priceBreakdown, isLoading: isCalculating } = usePriceCalculation(
    shouldFetchPrice ? property.id : undefined,
    shouldFetchPrice ? checkIn : undefined,
    shouldFetchPrice ? checkOut : undefined
  );

  const totalGuests = guests.adults + guests.children + guests.infants;
  const isValidBooking = shouldFetchPrice && totalGuests > 0 && totalGuests <= property.max_guests;

  const updateGuests = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const handleBookNow = () => {
    if (!isValidBooking) return;
    // Navigate to booking page or open booking modal
    // This would integrate with your booking flow
  };

  // Set default dates (today + 1 day for check-in, + 3 days for check-out)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 sticky top-24">
      {/* Price Header */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display text-luxury-gold">
            {property.price_currency} {property.base_price.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">
            / {PRICING_MODEL_LABELS[property.pricing_model].toLowerCase()}
          </span>
        </div>
        {property.instant_booking && (
          <div className="flex items-center gap-2 mt-2 text-emerald-400 text-sm">
            <Check className="w-4 h-4" />
            <span>Instant Booking Available</span>
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-luxury-gold"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-luxury-gold"
            />
          </div>
        </div>
      </div>

      {/* Guest Selection */}
      <div className="relative mb-6">
        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
          Guests
        </label>
        <button
          onClick={() => setShowGuestDropdown(!showGuestDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 text-white text-sm hover:border-luxury-gold/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-luxury-gold" />
            <span>
              {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
              {guests.children > 0 && `, ${guests.children} child${guests.children !== 1 ? 'ren' : ''}`}
              {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showGuestDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Guest Dropdown */}
        {showGuestDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-luxury-charcoal border border-white/10 p-4 z-20"
          >
            {[
              { key: 'adults', label: 'Adults', sublabel: 'Ages 13+' },
              { key: 'children', label: 'Children', sublabel: 'Ages 2-12' },
              { key: 'infants', label: 'Infants', sublabel: 'Under 2' },
            ].map(({ key, label, sublabel }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-white text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{sublabel}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuests(key as keyof typeof guests, -1)}
                    disabled={guests[key as keyof typeof guests] === 0}
                    className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-white">{guests[key as keyof typeof guests]}</span>
                  <button
                    onClick={() => updateGuests(key as keyof typeof guests, 1)}
                    disabled={totalGuests >= property.max_guests}
                    className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <p className="text-gray-500 text-xs mt-3">
              Maximum {property.max_guests} guests
            </p>
          </motion.div>
        )}
      </div>

      {/* Price Breakdown */}
      {priceBreakdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 mb-6 pb-6 border-b border-white/10"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              {property.price_currency} {priceBreakdown.nightly_rate.toLocaleString()} x {priceBreakdown.nights} nights
            </span>
            <span className="text-white">
              {property.price_currency} {priceBreakdown.base_price_total.toLocaleString()}
            </span>
          </div>
          
          {priceBreakdown.seasonal_adjustment !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Seasonal adjustment</span>
              <span className={priceBreakdown.seasonal_adjustment > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                {priceBreakdown.seasonal_adjustment > 0 ? '+' : ''}
                {property.price_currency} {Math.abs(priceBreakdown.seasonal_adjustment).toLocaleString()}
              </span>
            </div>
          )}
          
          {priceBreakdown.cleaning_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cleaning fee</span>
              <span className="text-white">
                {property.price_currency} {priceBreakdown.cleaning_fee.toLocaleString()}
              </span>
            </div>
          )}
          
          {priceBreakdown.service_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service fee</span>
              <span className="text-white">
                {property.price_currency} {priceBreakdown.service_fee.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-3 border-t border-white/10">
            <span className="text-white font-bold">Total</span>
            <span className="text-luxury-gold font-bold">
              {property.price_currency} {priceBreakdown.total_price.toLocaleString()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookNow}
        disabled={!isValidBooking || isCalculating}
        className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Calculating...
          </>
        ) : (
          property.instant_booking ? 'Book Now' : 'Request to Book'
        )}
      </button>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs">
          You won't be charged yet
        </p>
        {property.security_deposit && property.security_deposit > 0 && (
          <p className="text-gray-500 text-xs mt-1">
            Security deposit: {property.price_currency} {property.security_deposit.toLocaleString()}
          </p>
        )}
        {property.min_stay_nights && property.min_stay_nights > 1 && (
          <p className="text-gray-500 text-xs mt-1">
            Minimum stay: {property.min_stay_nights} nights
          </p>
        )}
      </div>
    </div>
  );
}
