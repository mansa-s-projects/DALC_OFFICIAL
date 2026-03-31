import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export interface CollectionItem {
  id: string;
  title: string;
  descriptor: string;
  /** Emoji or SVG icon string used as a visual accent */
  icon: string;
  /** Tailwind gradient class for the card accent strip */
  accentClass?: string;
  /** Matching filter values to apply when card is clicked */
  filter?: {
    category?: string;
    emirate?: string;
    hiddenGems?: 'all' | 'true' | 'false';
  };
}

interface CollectionCardProps {
  item: CollectionItem;
  index: number;
  onClick: (item: CollectionItem) => void;
}

export default function CollectionCard({ item, index, onClick }: CollectionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(item)}
      className="group relative flex w-[260px] flex-none cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(200,164,107,0.14)] bg-[#111214] p-6 transition-all duration-350 hover:border-[rgba(200,164,107,0.48)] hover:shadow-[0_12px_48px_-8px_rgba(200,164,107,0.18)]"
      aria-label={`Browse ${item.title}`}
    >
      {/* Icon */}
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(200,164,107,0.15)] bg-[rgba(200,164,107,0.06)] text-xl leading-none transition-all duration-300 group-hover:border-[rgba(200,164,107,0.4)] group-hover:bg-[rgba(200,164,107,0.12)]">
        {item.icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#C8A46B]">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[0.78rem] leading-relaxed text-[#B6B6B6]/65">
          {item.descriptor}
        </p>
      </div>

      {/* Arrow */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#B6B6B6]/35 transition-colors duration-300 group-hover:text-[#C8A46B]/50">
          Discover
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(200,164,107,0.18)] text-[#C8A46B]/35 transition-all duration-300 group-hover:border-[rgba(200,164,107,0.6)] group-hover:bg-[rgba(200,164,107,0.1)] group-hover:text-[#C8A46B]">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Animated bottom gold line */}
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#C8A46B] via-[#C8A46B]/55 to-transparent transition-all duration-500 group-hover:w-full" />

      {/* Top-left corner glow on hover */}
      <span className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.10),transparent_70%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
    </motion.article>
  );
}
