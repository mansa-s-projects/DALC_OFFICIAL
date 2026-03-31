import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight, Clock, Flame } from 'lucide-react';
import { useTrendingExperiences } from '../../hooks/useExperiences';
import type { ExperienceService } from '../../types/experiences';

interface TrendingCardProps {
  experience: ExperienceService;
  index: number;
}

function TrendingCard({ experience, index }: TrendingCardProps) {
  const { name, slug, subcategory, hero_image, price_from, price_currency, trending_score } = experience;

  const rank = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex-shrink-0 w-72"
    >
      <Link
        href={`/experiences/${subcategory}/${slug}`}
        className="group block relative h-40 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
      >
        {/* Background Image */}
        {hero_image && (
          <img
            src={hero_image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent" />

        {/* Rank Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold ${
            rank === 1 ? 'bg-luxury-gold text-luxury-black' : 
            rank === 2 ? 'bg-gray-300 text-luxury-black' : 
            rank === 3 ? 'bg-amber-700 text-white' : 
            'bg-white/10 text-white border border-white/20'
          }`}>
            {rank}
          </div>
          {rank <= 3 && (
            <Flame className={`w-4 h-4 ${
              rank === 1 ? 'text-luxury-gold' : 
              rank === 2 ? 'text-gray-300' : 
              'text-amber-700'
            }`} />
          )}
        </div>

        {/* Trending Score */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-luxury-gold text-xs">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="font-medium">{trending_score}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2">
            {name}
          </h3>
          {price_from && (
            <p className="text-luxury-gold/80 text-xs">
              From {price_currency} {price_from.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function TrendingStrip() {
  const { data: trending = [], isLoading } = useTrendingExperiences(6);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-4 px-4 md:px-8">
          <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
        </div>
        <div className="flex gap-4 px-4 md:px-8 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-40 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (trending.length === 0) return null;

  return (
    <section className="py-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-luxury-gold/10 border border-luxury-gold/30">
              <TrendingUp className="w-4 h-4 text-luxury-gold" />
            </div>
            <div>
              <h2 className="text-white font-display text-lg">Trending Now</h2>
              <p className="text-gray-500 text-xs">Most popular experiences this week</p>
            </div>
          </div>
          <Link
            href="/experiences"
            className="hidden sm:flex items-center gap-1 text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 px-4 md:px-8 overflow-x-auto pb-2 scrollbar-hide">
          {trending.map((experience, idx) => (
            <TrendingCard key={experience.id} experience={experience} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
