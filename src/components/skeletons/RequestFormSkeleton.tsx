import React from 'react';

export default function RequestFormSkeleton() {
  return (
    <div className="glass-panel p-8 md:p-12 rounded-xl border border-white/10 animate-pulse space-y-6">
      <div className="h-4 w-24 bg-white/15 rounded" />
      <div className="h-12 w-full bg-white/10 rounded" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-12 w-full bg-white/10 rounded" />
        <div className="h-12 w-full bg-white/10 rounded" />
      </div>
      <div className="h-4 w-32 bg-white/15 rounded" />
      <div className="h-28 w-full bg-white/10 rounded" />
      <div className="h-12 w-full bg-luxury-gold/20 rounded" />
    </div>
  );
}
