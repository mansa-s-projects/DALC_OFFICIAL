'use client';

import React from 'react';
import type { VenueItem } from '../types';

type VenueCardProps = {
  item: VenueItem;
};

export default function VenueCard({ item }: VenueCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="font-display text-lg text-[#EBD2A0]">{item.title}</p>
      <p className="text-sm text-white/65">{item.area}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/45">{item.vibe}</p>
    </div>
  );
}
