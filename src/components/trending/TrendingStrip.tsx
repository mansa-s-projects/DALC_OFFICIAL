import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Venue, UserSkill } from '../../types';
import { getMatchPercentage } from '../../utils/recommendations';
import { useAppStore } from '../../store/useAppStore';
import Link from 'next/link';

interface TrendingStripProps {
  venues: Venue[];
  userSkills?: UserSkill[];
}

function getTimeLabel(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Trending this morning';
  if (hour < 17) return 'Trending this afternoon';
  if (hour < 21) return 'Trending tonight';
  return 'Trending right now';
}

export default function TrendingStrip({ venues, userSkills = [] }: TrendingStripProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPaused = useAppStore((s) => s.isTrendingStripPaused);
  const setPaused = useAppStore((s) => s.setTrendingStripPaused);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayVenues = venues.slice(0, 5);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayVenues.length);
  }, [displayVenues.length]);

  useEffect(() => {
    if (isPaused || displayVenues.length <= 1) return;
    intervalRef.current = setInterval(advance, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, advance, displayVenues.length]);

  if (displayVenues.length === 0) return null;

  const goTo = (dir: 'prev' | 'next') => {
    setCurrentIndex((prev) =>
      dir === 'next'
        ? (prev + 1) % displayVenues.length
        : (prev - 1 + displayVenues.length) % displayVenues.length
    );
  };

  return (
    <section className="relative py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <Flame className="w-5 h-5 text-amber-500" />
          </motion.div>
          <h2 className="text-xl md:text-2xl font-display text-white">{getTimeLabel()}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => goTo('prev')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => goTo('next')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden max-w-7xl mx-auto px-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / Math.min(displayVenues.length, 3))}%)` }}
        >
          {displayVenues.map((venue, i) => {
            const matchPct = getMatchPercentage(venue, userSkills);
            return (
              <Link
                key={venue.id}
                href={`/venue/${venue.id}`}
                className="flex-shrink-0 w-full md:w-[calc(33.333%-0.75rem)] group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative h-[280px] rounded-lg overflow-hidden"
                >
                  <img
                    src={venue.hero_image || undefined}
                    alt={venue.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Trending Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-2.5 py-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Trending</span>
                  </div>

                  {/* Match Badge */}
                  {matchPct > 50 && (
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
                      <span className="text-[10px] font-bold text-white">{matchPct}% match</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{venue.subcategory}</p>
                    <h3 className="text-xl font-display text-white font-medium mb-1">{venue.name}</h3>
                    <p className="text-gray-400 text-xs">{venue.area}</p>

                    {/* Skill pills */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {venue.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25 rounded-full px-2 py-0.5"
                        >
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {displayVenues.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-luxury-gold w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
