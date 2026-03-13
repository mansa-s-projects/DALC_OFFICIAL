import React from 'react';

export default function VenueCardSkeleton() {
  return (
    <div className="relative h-[420px] w-full rounded-sm overflow-hidden bg-luxury-charcoal border border-white/5 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute top-4 left-4 h-5 w-20 bg-luxury-gold/20 rounded" />
      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <div className="h-3 w-24 bg-luxury-gold/20 rounded" />
        <div className="h-8 w-2/3 bg-white/20 rounded" />
        <div className="h-3 w-1/2 bg-white/15 rounded" />
        <div className="h-3 w-5/6 bg-white/10 rounded" />
        <div className="h-10 w-full bg-white/15 rounded" />
      </div>
    </div>
  );
}
