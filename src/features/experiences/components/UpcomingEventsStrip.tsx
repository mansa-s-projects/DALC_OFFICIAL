'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useUpcomingEvents } from '../hooks/useExperiences';
import type { ExperienceService } from '../types';

function EventCard({ event, index }: { event: ExperienceService; index: number }) {
  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const daysUntil = eventDate 
    ? Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex-shrink-0 w-[300px] group"
    >
      <Link 
        href={`/experiences/tickets-and-culture/${event.slug}`}
        className="block h-full border border-white/10 bg-white/[0.02] overflow-hidden hover:border-luxury-gold/40 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.hero_image || '/images/placeholder-experience.jpg'}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Days until badge */}
          {daysUntil !== null && (
            <div className="absolute top-3 left-3">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                daysUntil <= 3 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : daysUntil <= 7 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <Sparkles className="w-3 h-3" />
                {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
              </div>
            </div>
          )}

          {/* Date badge */}
          {eventDate && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2 text-white">
                <div className="bg-luxury-gold text-luxury-black px-2 py-1 text-center min-w-[48px]">
                  <div className="text-[10px] uppercase font-bold tracking-wider">
                    {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-lg font-bold leading-none">
                    {eventDate.getDate()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 truncate">
                    {eventDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-sm font-medium truncate">{event.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
            {event.venue_name || 'Dubai Experience'}
          </p>
          <h3 className="text-white font-display text-sm mb-3 line-clamp-2 group-hover:text-luxury-gold transition-colors">
            {event.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.duration_minutes ? `${Math.round(event.duration_minutes / 60)}h` : 'TBD'}
              </span>
              {event.price_from && (
                <span className="text-luxury-gold">
                  From AED {event.price_from.toLocaleString()}
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function UpcomingEventsStrip() {
  const { data: events = [], isLoading } = useUpcomingEvents(6);

  if (isLoading) {
    return (
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[300px] h-[280px] bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h2 className="text-xl font-display text-white">This Week in Dubai</h2>
              <p className="text-gray-500 text-sm">Upcoming exclusive events and experiences</p>
            </div>
          </div>
          <Link 
            href="/experiences/tickets-and-culture"
            className="hidden sm:flex items-center gap-2 text-luxury-gold text-sm hover:text-white transition-colors"
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {events.map((event, index) => (
              <div key={event.id} className="snap-start">
                <EventCard event={event} index={index} />
              </div>
            ))}
          </div>
          
          {/* Fade edges */}
          <div className="absolute top-0 right-0 bottom-4 w-24 bg-gradient-to-l from-luxury-black to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
