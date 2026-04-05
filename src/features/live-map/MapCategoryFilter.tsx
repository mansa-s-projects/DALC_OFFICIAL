'use client';

import React from 'react';

// ─── Filter definitions ───────────────────────────────────────────────────────

export type FilterId =
  | 'all'
  | 'landmarks'
  | 'culture'
  | 'dining'
  | 'nightlife'
  | 'nature';

type FilterDef = {
  id: FilterId;
  label: string;
  color: string;
  /** category values from Supabase that belong to this filter */
  matches: string[];
};

export const FILTERS: FilterDef[] = [
  {
    id: 'all',
    label: 'All',
    color: '#C8A46B',
    matches: [], // special-cased in matchesFilter
  },
  {
    id: 'landmarks',
    label: 'Landmarks',
    color: '#C8A46B',
    matches: ['landmark', 'attraction', 'viewpoint', 'shopping'],
  },
  {
    id: 'culture',
    label: 'Culture',
    color: '#8B5CF6',
    matches: ['museum', 'cultural site', 'hidden gem'],
  },
  {
    id: 'dining',
    label: 'Dining',
    color: '#F59E0B',
    matches: ['restaurant', 'beach club'],
  },
  {
    id: 'nightlife',
    label: 'Nightlife',
    color: '#EC4899',
    matches: ['nightlife'],
  },
  {
    id: 'nature',
    label: 'Nature',
    color: '#10B981',
    matches: ['park', 'desert', 'mountain', 'coastal', 'nature'],
  },
];

/** Returns true if a location's category passes the given filter */
export function matchesFilter(category: string, filterId: FilterId): boolean {
  if (filterId === 'all') return true;
  const def = FILTERS.find((f) => f.id === filterId);
  if (!def) return true;
  const normalized = (category ?? '').toLowerCase().trim();
  return def.matches.some((m) => normalized === m || normalized.includes(m));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MapCategoryFilterProps {
  active: FilterId;
  onChange: (id: FilterId) => void;
}

export function MapCategoryFilter({ active, onChange }: MapCategoryFilterProps) {
  return (
    <>
      <style>{`
        .dalc-filter-bar {
          position: absolute;
          top: 108px;
          left: 0;
          right: 0;
          z-index: 10;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          pointer-events: none;
        }
        .dalc-filter-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          pointer-events: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 2px 6px;
        }
        .dalc-filter-scroll::-webkit-scrollbar {
          display: none;
        }
        .dalc-filter-pill {
          flex-shrink: 0;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.45);
          transition: background 180ms, border-color 180ms, color 180ms, box-shadow 180ms;
          white-space: nowrap;
          outline: none;
        }
        .dalc-filter-pill:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.2);
        }
        .dalc-filter-pill.active {
          color: var(--pill-color);
          background: color-mix(in srgb, var(--pill-color) 14%, transparent);
          border-color: color-mix(in srgb, var(--pill-color) 45%, transparent);
          box-shadow: 0 0 12px color-mix(in srgb, var(--pill-color) 20%, transparent);
        }
        .dalc-filter-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
          flex-shrink: 0;
        }
      `}</style>

      <div className="dalc-filter-bar">
        <div className="dalc-filter-scroll" role="tablist" aria-label="Filter map locations by category">
          {FILTERS.map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(filter.id)}
                className={`dalc-filter-pill${isActive ? ' active' : ''}`}
                style={{ '--pill-color': filter.color } as React.CSSProperties}
              >
                {filter.id !== 'all' && <span className="dalc-filter-dot" />}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
