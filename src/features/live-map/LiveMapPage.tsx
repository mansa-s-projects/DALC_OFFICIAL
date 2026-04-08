'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { MapRef, Marker, type MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapSidePanel, getCategoryColor, type MapLocation } from './MapSidePanel';
import { ALL_EXPLORE_LOCATIONS } from '@/explore/data/exploreLocations';
import { MapCategoryFilter, matchesFilter, type FilterId } from './MapCategoryFilter';
import { MapSearchOverlay } from './MapSearchOverlay';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

const UAE_CENTER = {
  longitude: 54.3773,
  latitude: 24.4539,
  zoom: 6.5,
};

// ─── Custom marker ────────────────────────────────────────────────────────────

function VenueMarker({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="venue marker"
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          width: active ? 28 : 22,
          height: active ? 28 : 22,
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          opacity: active ? 0.7 : 0.4,
          pointerEvents: 'none',
          transition: 'width 200ms, height 200ms, opacity 200ms',
        }}
      />
      <span
        style={{
          width: active ? 12 : 10,
          height: active ? 12 : 10,
          borderRadius: '50%',
          background: color,
          boxShadow: active
            ? `0 0 14px ${color}cc, 0 0 4px ${color}`
            : `0 0 8px ${color}99`,
          flexShrink: 0,
          transition: 'width 200ms, height 200ms, box-shadow 200ms',
        }}
      />
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesSearch(venue: MapLocation, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    venue.name.toLowerCase().includes(q) ||
    venue.category.toLowerCase().includes(q) ||
    venue.locationStr?.toLowerCase().includes(q) ||
    venue.tags?.some((tag) => tag.toLowerCase().includes(q)) || false
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveMapPage() {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(UAE_CENTER);
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const venues = useMemo(
    () =>
      ALL_EXPLORE_LOCATIONS
      .filter((location) => isFinite(location.latitude) && isFinite(location.longitude))
      .map((location) => {
        const tierCount = Math.max(0, Math.min(4, Math.floor(Number(location.price_tier) || 0)));

        return {
          id: location.id,
          name: location.name,
          category: location.category,
          description: location.long_description || location.short_description,
          latitude: location.latitude,
          longitude: location.longitude,
          locationStr: `${location.area}, ${location.emirate}`,
          tags: location.tags,
          priceRange: tierCount > 0 ? 'AED ' + '$'.repeat(tierCount) : 'AED -',
          vibe: location.vibe,
          bestTime: location.best_time,
          insiderTip: location.insider_tip,
          detailHref: '/explore',
          requestHref: `/request?location=${encodeURIComponent(location.name)}`,
          requestLabel: 'Plan with Concierge',
        };
      }),
    [],
  );

  // Combine category filter + search query — no refetch
  const visibleVenues = useMemo(
    () =>
      venues.filter(
        (v) =>
          matchesFilter(v.category, activeFilter) &&
          matchesSearch(v, searchQuery),
      ),
    [venues, activeFilter, searchQuery],
  );

  const activeSelected = useMemo(
    () => visibleVenues.find((venue) => venue.id === selected?.id) ?? null,
    [selected?.id, visibleVenues],
  );

  const handleFilterChange = useCallback((id: FilterId) => {
    setActiveFilter(id);
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    setSearchQuery(v);
  }, []);

  const handleMarkerClick = useCallback((venue: MapLocation) => {
    setSelected((prev) => (prev?.id === venue.id ? null : venue));
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Live Map</p>
          <p className="text-gray-400 text-sm">Map unavailable — set NEXT_PUBLIC_MAPBOX_TOKEN to enable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* Top gradient bar — branding only */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center px-5 py-4"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              color: '#C8A46B',
              fontSize: 13,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontFamily: 'serif',
            }}
          >
            DALC
          </span>
          <span
            style={{
              width: 1,
              height: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Live Map
          </span>
          {venues.length > 0 && (
            <span
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.08em',
              }}
            >
              · {visibleVenues.length}/{venues.length}
            </span>
          )}
        </div>
      </div>

      {/* Search input — top left, below title */}
      <MapSearchOverlay value={searchQuery} onChange={handleSearchChange} />

      {/* Category filter pills — centered, below search */}
      <MapCategoryFilter active={activeFilter} onChange={handleFilterChange} />

      {/* Mapbox map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        reuseMaps
        onClick={(e: MapMouseEvent) => {
          if ((e.originalEvent.target as HTMLElement).tagName === 'CANVAS') {
            setSelected(null);
          }
        }}
      >
        {visibleVenues.map((venue) => (
          <Marker
            key={venue.id}
            longitude={venue.longitude}
            latitude={venue.latitude}
            anchor="center"
          >
            <VenueMarker
              color={getCategoryColor(venue.category)}
              active={activeSelected?.id === venue.id}
              onClick={() => handleMarkerClick(venue)}
            />
          </Marker>
        ))}
      </Map>

      {/* Side panel / bottom sheet */}
      <MapSidePanel venue={activeSelected} onClose={handleClose} />
    </div>
  );
}
