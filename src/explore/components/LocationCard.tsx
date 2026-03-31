import { motion } from 'motion/react';
import { Gem, MapPin, ArrowUpRight } from 'lucide-react';
import type { ExploreLocation } from '../types';

interface LocationCardProps {
  location: ExploreLocation;
  index: number;
  onClick: (location: ExploreLocation) => void;
}

export default function LocationCard({ location, index, onClick }: LocationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.42), ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(location)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(200,164,107,0.15)] bg-[#111214] p-6 transition-all duration-300 hover:border-[rgba(200,164,107,0.5)] hover:shadow-[0_8px_40px_-8px_rgba(200,164,107,0.22)]"
      aria-label={`View details for ${location.name}`}
    >
      {/* Top-right gem badge */}
      {location.is_hidden_gem && (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[rgba(200,164,107,0.3)] bg-[rgba(200,164,107,0.08)] px-3 py-1 backdrop-blur-sm">
          <Gem className="h-3 w-3 text-[#C8A46B]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A46B]">
            Hidden Gem
          </span>
        </div>
      )}

      {/* Category pill */}
      {location.category && (
        <div className="mb-4 w-fit rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B6B6B6]/70">
          {location.category}
        </div>
      )}

      {/* Name */}
      <h3 className="pr-24 font-display text-xl font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#C8A46B]">
        {location.name}
      </h3>

      {/* Short description */}
      {location.short_description && (
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-[#B6B6B6]">
          {location.short_description}
        </p>
      )}

      {/* Footer row */}
      <div className="mt-5 flex items-center justify-between">
        {/* Emirate */}
        {location.emirate ? (
          <span className="flex items-center gap-1.5 text-xs text-[#B6B6B6]/55">
            <MapPin className="h-3 w-3" />
            {location.emirate}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-[#B6B6B6]/40">
            <MapPin className="h-3 w-3" />
            {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
          </span>
        )}

        {/* Arrow caret */}
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(200,164,107,0.2)] text-[#C8A46B]/40 transition-all duration-300 group-hover:border-[rgba(200,164,107,0.6)] group-hover:bg-[rgba(200,164,107,0.08)] group-hover:text-[#C8A46B]">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Animated bottom gold line */}
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#C8A46B] via-[#C8A46B]/60 to-transparent transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
}
