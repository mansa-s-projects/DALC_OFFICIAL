'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoryTabId = 'all' | 'restaurants' | 'beach-clubs' | 'night-clubs' | 'dining-entertainment';

interface CategoryTab {
  id: CategoryTabId;
  label: string;
  count: number;
}

interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeTab: CategoryTabId;
  onChange: (id: CategoryTabId) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryTabs({ tabs, activeTab, onChange }: CategoryTabsProps) {
  return (
    <div className="relative">
      {/* Fade overlay for mobile scroll */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-luxury-black to-transparent z-10 pointer-events-none md:hidden" />

      <div
        role="tablist"
        aria-label="Venue categories"
        className="flex items-end gap-6 md:gap-10 overflow-x-auto border-b border-white/8 pb-0"
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
                  layoutId="venues-cat-underline"
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
