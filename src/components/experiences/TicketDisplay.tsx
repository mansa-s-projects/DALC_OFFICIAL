import React from 'react';
import { motion } from 'motion/react';
import { QrCode, CheckCircle2, Calendar, Clock, MapPin, Users, Copy, Download } from 'lucide-react';
import type { ExperienceBooking } from '../../types/experiences';
import { TICKET_STATUS_LABELS } from '../../types/experiences';

interface TicketDisplayProps {
  booking: ExperienceBooking;
}

export default function TicketDisplay({ booking }: TicketDisplayProps) {
  const {
    ticket_code,
    ticket_status,
    booking_date,
    time_slot,
    party_size,
    tier,
    total_price,
    currency,
    service,
  } = booking;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket_code);
  };

  const getStatusColor = () => {
    switch (ticket_status) {
      case 'active':
        return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'used':
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      case 'expired':
        return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'refunded':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-black border-2 border-luxury-gold/30 overflow-hidden"
    >
      {/* Ticket Header */}
      <div className="bg-luxury-gold/10 border-b border-luxury-gold/30 p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/20 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-luxury-gold" />
        </div>
        <h2 className="text-white font-display text-2xl mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400 text-sm">
          Your ticket has been generated. Present this at the venue.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Ticket Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Ticket Code */}
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Ticket Code</p>
            <div className="flex items-center gap-3">
              <code className="text-3xl font-mono text-luxury-gold tracking-wider">
                {ticket_code}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 border border-white/10 text-gray-400 hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Experience Name */}
          {service && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Experience</p>
              <h3 className="text-white font-display text-xl">{service.name}</h3>
              {service.venue_name && (
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {service.venue_name}
                </p>
              )}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-white/10 p-3">
              <Calendar className="w-4 h-4 text-luxury-gold mb-2" />
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">Date</p>
              <p className="text-white text-sm">
                {new Date(booking_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            {time_slot && (
              <div className="border border-white/10 p-3">
                <Clock className="w-4 h-4 text-luxury-gold mb-2" />
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Time</p>
                <p className="text-white text-sm">{time_slot}</p>
              </div>
            )}

            <div className="border border-white/10 p-3">
              <Users className="w-4 h-4 text-luxury-gold mb-2" />
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">Guests</p>
              <p className="text-white text-sm">{party_size}</p>
            </div>

            <div className="border border-white/10 p-3">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Tier</p>
              <p className="text-white text-sm">{tier}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-sm font-medium ${getStatusColor()}`}>
              {TICKET_STATUS_LABELS[ticket_status]}
            </span>
          </div>

          {/* Price */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Paid</span>
              <span className="text-luxury-gold font-display text-2xl">
                {currency} {total_price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: QR Code Placeholder */}
        <div className="md:col-span-1 flex flex-col items-center justify-center border-l border-white/10 md:pl-6">
          <div className="w-40 h-40 bg-white p-3 mb-4">
            {/* QR Code Placeholder */}
            <div className="w-full h-full bg-luxury-black flex items-center justify-center">
              <QrCode className="w-24 h-24 text-white" />
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mb-4">
            Scan at venue entrance
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold/10 transition-colors">
            <Download className="w-4 h-4" />
            Download Ticket
          </button>
        </div>
      </div>

      {/* Tear-off perforation effect */}
      <div className="relative h-4 bg-luxury-black">
        <div className="absolute inset-x-0 top-0 flex justify-between">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-luxury-charcoal rounded-full -mt-1.5" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-white/20" />
      </div>

      {/* Footer */}
      <div className="bg-white/[0.02] p-4 text-center">
        <p className="text-gray-500 text-xs">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </motion.div>
  );
}
