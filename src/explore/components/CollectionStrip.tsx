import { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CollectionCard, { type CollectionItem } from './CollectionCard';
import type { ExploreFilterState } from '../types';

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    descriptor: 'Quiet discoveries most travellers never find.',
    icon: '💎',
    filter: { hiddenGems: 'true' },
  },
  {
    id: 'desert-escapes',
    title: 'Desert Escapes',
    descriptor: 'The silence and beauty of the Arabian sands.',
    icon: '🏜️',
    filter: { category: 'Desert' },
  },
  {
    id: 'coastal-views',
    title: 'Coastal Views',
    descriptor: 'Beaches, corniche, and open sea horizons.',
    icon: '🌊',
    filter: { category: 'Coastal' },
  },
  {
    id: 'sunset-spots',
    title: 'Sunset Spots',
    descriptor: 'Golden hour vantages across the Emirates.',
    icon: '🌅',
    filter: { category: 'Viewpoint' },
  },
  {
    id: 'cultural-icons',
    title: 'Cultural Icons',
    descriptor: 'Heritage, history, and living tradition.',
    icon: '🕌',
    filter: { category: 'Cultural' },
  },
  {
    id: 'mountain-retreats',
    title: 'Mountain Retreats',
    descriptor: 'Hajar peaks, wadis, and cooler elevations.',
    icon: '⛰️',
    filter: { category: 'Mountain' },
  },
  {
    id: 'weekend-escapes',
    title: 'Weekend Escapes',
    descriptor: 'Complete getaways within a short drive.',
    icon: '🚗',
    filter: { category: 'Nature' },
  },
  {
    id: 'abu-dhabi',
    title: 'Abu Dhabi Picks',
    descriptor: "The capital's best-kept and boldest places.",
    icon: '🏛️',
    filter: { emirate: 'Abu Dhabi' },
  },
  {
    id: 'dubai-hidden',
    title: 'Beyond Dubai',
    descriptor: "Past the skyline — Dubai's quiet side.",
    icon: '🌆',
    filter: { emirate: 'Dubai', hiddenGems: 'true' },
  },
];

interface CollectionStripProps {
  onCollectionSelect: (partial: Partial<ExploreFilterState>) => void;
}

export default function CollectionStrip({ onCollectionSelect }: CollectionStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardClick = useCallback(
    (item: CollectionItem) => {
      if (!item.filter) return;
      const patch: Partial<ExploreFilterState> = {};
      if (item.filter.emirate)    patch.emirate    = item.filter.emirate;
      if (item.filter.category)   patch.category   = item.filter.category;
      if (item.filter.hiddenGems) patch.hiddenGems = item.filter.hiddenGems;
      onCollectionSelect(patch);
      document.getElementById('explore-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [onCollectionSelect],
  );

  const scrollBy = useCallback((dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }, []);

  return (
    <section className="relative bg-[#0B0B0C] pb-20 pt-4">

      {/* Section header */}
      <div className="mx-auto mb-10 max-w-[1600px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.5em] text-[#C8A46B]/70">
              Curated Collections
            </p>
            <h2 className="font-display text-3xl font-bold leading-snug text-white sm:text-4xl">
              Start your discovery
            </h2>
          </div>

          {/* Arrow controls — visible md+ */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(200,164,107,0.25)] text-[#C8A46B]/50 transition-all duration-200 hover:border-[rgba(200,164,107,0.6)] hover:text-[#C8A46B]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(200,164,107,0.25)] text-[#C8A46B]/50 transition-all duration-200 hover:border-[rgba(200,164,107,0.6)] hover:text-[#C8A46B]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="mt-5 h-px w-full origin-left bg-gradient-to-r from-[rgba(200,164,107,0.35)] via-[rgba(200,164,107,0.1)] to-transparent"
        />
      </div>

      {/* Scrollable card rail */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Left spacer aligns with content max-width on large screens */}
        <div className="hidden shrink-0 lg:block" style={{ width: 'max(0px, calc((100vw - 1600px) / 2))' }} />

        {COLLECTIONS.map((item, i) => (
          <CollectionCard key={item.id} item={item} index={i} onClick={handleCardClick} />
        ))}

        {/* Right fade cap */}
        <div className="hidden shrink-0 lg:block" style={{ width: 'max(0px, calc((100vw - 1600px) / 2))' }} />
      </div>

      {/* Right edge fade gradient */}
      <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-24 bg-gradient-to-l from-[#0B0B0C] to-transparent" />

      {/* Bottom section separator */}
      <div className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(200,164,107,0.15)] to-transparent" />
      </div>
    </section>
  );
}
