import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { Venue } from '../../types';

interface EditorialCardProps {
  venue: Venue;
  index: number;
}

export default function EditorialCard({ venue, index }: EditorialCardProps) {
  return (
    <Link href={`/venue/${venue.id}`} className="block group w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative flex flex-col gap-4"
      >
        {/* Image Container */}
        <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-sm bg-luxury-charcoal">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
          <img 
            src={venue.hero_image} 
            alt={venue.name} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
          
          {/* Badge */}
          {venue.is_featured && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                Editor's Pick
              </span>
            </div>
          )}

          {/* Hover Overlay - "Insider Guide" */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]">
             <div className="px-6 py-3 border border-white/40 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                View Insider Guide <ArrowUpRight className="w-4 h-4" />
             </div>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="flex flex-col gap-2 px-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-2xl md:text-3xl font-display text-white group-hover:text-luxury-gold transition-colors duration-300">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mt-1 font-medium">
                  <span className="text-luxury-gold">{venue.cuisine || venue.subcategory}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{venue.area}</span>
                </div>
             </div>
             {/* Rating Minimal */}
             {venue.recommend_score > 90 && (
               <div className="flex items-center gap-1 opacity-60">
                  <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
               </div>
             )}
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 max-w-md font-light border-l border-white/10 pl-3 mt-2">
            {venue.description_short}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}