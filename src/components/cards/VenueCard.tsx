import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, TrendingUp, Heart } from 'lucide-react';
import { Venue } from '../../types';
import Link from 'next/link';
import { useAppStore } from '../../store/useAppStore';

interface VenueCardProps {
  venue: Venue;
  matchScore?: number;
  matchExplanation?: string;
  showTrendingBadge?: boolean;
}

export default function VenueCard({
  venue,
  matchScore,
  matchExplanation,
  showTrendingBadge,
}: VenueCardProps) {
  const toggleSaved = useAppStore((s) => s.toggleSavedVenue);
  const savedVenues = useAppStore((s) => s.savedVenues);
  const isSaved = savedVenues.includes(venue.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative h-[420px] w-full rounded-sm overflow-hidden bg-luxury-charcoal"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={venue.hero_image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2 flex-wrap">
            {(showTrendingBadge || venue.is_trending) && (
              <span className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest border border-amber-500/30 rounded-full">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
            {venue.is_featured && (
              <span className="bg-luxury-gold text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                Featured
              </span>
            )}
            {matchScore != null && matchScore > 6 && (
              <span className="bg-white/10 backdrop-blur text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-white/20 rounded-full">
                {Math.round(matchScore * 10)}% Match
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(venue.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isSaved
                ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40'
                : 'bg-white/10 text-white/60 border border-white/10 hover:text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-luxury-gold' : ''}`} />
          </button>
        </div>

        {/* Bottom Content */}
        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
          {matchExplanation && (
            <p className="text-amber-400/80 text-[10px] font-medium uppercase tracking-wider mb-2">
              {matchExplanation}
            </p>
          )}

          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-1">
                {venue.subcategory}
              </p>
              <h3 className="text-2xl font-display text-white font-medium">{venue.name}</h3>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
              <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
              <span className="text-xs font-bold text-white">4.9</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{venue.area}</span>
            </div>
            <span>·</span>
            <div className="flex gap-0.5 text-luxury-gold text-xs">
              {[...Array(venue.price_tier)].map((_, i) => (
                <span key={i}>$</span>
              ))}
              {[...Array(4 - venue.price_tier)].map((_, i) => (
                <span key={i} className="text-gray-600">$</span>
              ))}
            </div>
          </div>

          {/* Skill Pills */}
          {venue.skills.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {venue.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300/80 border border-amber-500/20 rounded-full px-2 py-0.5"
                >
                  {skill.replace('_', ' ')}
                </span>
              ))}
              {venue.skills.length > 3 && (
                <span className="text-[9px] text-gray-500">+{venue.skills.length - 3}</span>
              )}
            </div>
          )}

          <Link href={`/venue/${venue.id}`} className="inline-block w-full">
            <button className="w-full py-3 bg-white/10 hover:bg-luxury-gold hover:text-black border border-white/20 hover:border-luxury-gold text-white uppercase text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-aura">
              View Details <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
