'use client';

import React, { useEffect, useRef } from 'react';

// ─── Shared type (imported by LiveMapPage) ────────────────────────────────────

export type Venue = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  locationStr?: string;
  tags?: string[];
  priceRange?: string;
  vibe?: string;
};

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  nightlife:     { color: '#A855F7', label: 'Nightlife'  },
  clubs:         { color: '#A855F7', label: 'Nightlife'  },
  'night-clubs': { color: '#A855F7', label: 'Nightclub'  },
  dining:        { color: '#F59E0B', label: 'Dining'     },
  restaurants:   { color: '#F59E0B', label: 'Restaurant' },
  'beach-clubs': { color: '#3B82F6', label: 'Beach Club' },
  beach:         { color: '#3B82F6', label: 'Beach Club' },
};

export function getCategoryColor(category: string): string {
  return CATEGORY_CONFIG[category?.toLowerCase()]?.color ?? '#C8A46B';
}

export function getCategoryLabel(category: string): string {
  const cfg = CATEGORY_CONFIG[category?.toLowerCase()];
  if (cfg) return cfg.label;
  if (!category) return 'Venue';
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

// ─── MapSidePanel ─────────────────────────────────────────────────────────────

interface MapSidePanelProps {
  venue: Venue | null;
  onClose: () => void;
}

export function MapSidePanel({ venue, onClose }: MapSidePanelProps) {
  const isOpen = venue !== null;
  const prevVenueRef = useRef<Venue | null>(null);

  // Keep previous venue during close animation so content doesn't vanish
  if (venue) prevVenueRef.current = venue;
  const displayVenue = venue ?? prevVenueRef.current;

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const color  = displayVenue ? getCategoryColor(displayVenue.category) : '#C8A46B';
  const label  = displayVenue ? getCategoryLabel(displayVenue.category) : '';

  return (
    <>
      {/* Injected CSS for responsive panel animation */}
      <style>{`
        .dalc-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 360px;
          height: 100%;
          z-index: 30;
          transform: translateX(100%);
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity  320ms ease;
          opacity: 0;
          pointer-events: none;
          will-change: transform;
          display: flex;
          flex-direction: column;
          background: #0a0a0c;
          border-left: 1px solid rgba(255,255,255,0.07);
          box-shadow: -24px 0 64px rgba(0,0,0,0.7);
        }
        .dalc-panel.open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }

        .dalc-backdrop {
          display: none;
        }

        @media (max-width: 640px) {
          .dalc-panel {
            top: auto;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60vh;
            min-height: 320px;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.07);
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -16px 48px rgba(0,0,0,0.7);
            transform: translateY(100%);
          }
          .dalc-panel.open {
            transform: translateY(0);
          }
          .dalc-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 29;
            opacity: 0;
            pointer-events: none;
            transition: opacity 320ms ease;
          }
          .dalc-backdrop.open {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className={`dalc-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`dalc-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Venue details"
      >
        {displayVenue && (
          <>
            {/* Accent bar */}
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}00)`,
                flexShrink: 0,
              }}
            />

            {/* Header */}
            <div
              style={{
                padding: '20px 20px 0',
                background: `linear-gradient(160deg, ${color}12 0%, transparent 60%)`,
                flexShrink: 0,
              }}
            >
              {/* Top row: badge + close */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color,
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    borderRadius: 999,
                    padding: '3px 10px',
                  }}
                >
                  {label}
                </span>

                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    flexShrink: 0,
                    transition: 'background 150ms, color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Venue name */}
              <h2
                style={{
                  color: '#fff',
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {displayVenue.name}
              </h2>

              {/* Location hint */}
              <p
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: 12,
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                {displayVenue.locationStr || 'Dubai'}
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                margin: '20px 20px 0',
                background: 'rgba(255,255,255,0.06)',
                flexShrink: 0,
              }}
            />

            {/* Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
              }}
            >
              {displayVenue.description ? (
                <p
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: '0 0 16px',
                  }}
                >
                  {displayVenue.description}
                </p>
              ) : (
                <p
                  style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: 12,
                    fontStyle: 'italic',
                    margin: '0 0 16px',
                  }}
                >
                  No description available.
                </p>
              )}

              {/* Extra Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {displayVenue.vibe && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, minWidth: 60 }}>Vibe:</span>
                    <span style={{ color: '#fff', fontSize: 13 }}>{displayVenue.vibe}</span>
                  </div>
                )}
                {displayVenue.priceRange && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, minWidth: 60 }}>Price:</span>
                    <span style={{ color: color, fontSize: 13, fontWeight: 600 }}>{displayVenue.priceRange}</span>
                  </div>
                )}
                {displayVenue.tags && displayVenue.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {displayVenue.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: 11,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div
              style={{
                padding: '16px 20px 28px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flexShrink: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
              }}
            >
              {/* View Details */}
              <a
                href={`/venue/${displayVenue.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: color,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  transition: 'filter 150ms',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(1.15)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.filter = 'none')}
              >
                View Details
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              {/* Request */}
              <a
                href={`/concierge/request?venue=${displayVenue.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  transition: 'background 150ms, border-color 150ms, color 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.1)';
                  el.style.borderColor = 'rgba(255,255,255,0.25)';
                  el.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.05)';
                  el.style.borderColor = 'rgba(255,255,255,0.12)';
                  el.style.color = 'rgba(255,255,255,0.75)';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Request a Table
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
