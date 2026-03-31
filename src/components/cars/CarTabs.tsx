'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarTabId = 'all' | 'economy' | 'standard' | 'luxury' | 'business' | 'sport' | 'electric';

interface CarTab {
  id: CarTabId;
  label: string;
  count: number;
}

interface CarTabsProps {
  tabs: CarTab[];
  activeTab: CarTabId;
  onChange: (id: CarTabId) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CarTabs({ tabs, activeTab, onChange }: CarTabsProps) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-luxury-black to-transparent z-10 pointer-events-none md:hidden" />

      <div
        role="tablist"
        aria-label="Car categories"
        className="flex items-end gap-5 md:gap-8 overflow-x-auto border-b border-white/8 pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex-shrink-0 pb-4 transition-colors duration-300 whitespace-nowrap flex items-baseline gap-1.5',
                isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
              )}
            >
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {tab.label}
              </span>
              <span
                className={cn(
                  'text-[8px] font-medium tabular-nums transition-colors duration-300',
                  isActive ? 'text-gray-500' : 'text-gray-700'
                )}
              >
                {tab.count}
              </span>

              {isActive && (
                <motion.div
                  layoutId="car-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-luxury-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
