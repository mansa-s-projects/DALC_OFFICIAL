'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { MapRef, Marker, type MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapSidePanel, getCategoryColor, type Venue } from './MapSidePanel';
import { getAllVenues } from '@/data/venuesData';
import { MapCategoryFilter, matchesFilter, type FilterId } from './MapCategoryFilter';
import { MapSearchOverlay } from './MapSearchOverlay';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

const DUBAI_CENTER = {
  longitude: 55.2708,
  latitude: 25.2048,
  zoom: 11,
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

function matchesSearch(venue: Venue, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    venue.name.toLowerCase().includes(q) ||
    venue.category.toLowerCase().includes(q)
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveMapPage() {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(DUBAI_CENTER);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selected, setSelected] = useState<Venue | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load venues from local robust data
  useEffect(() => {
    const rawData = getAllVenues();
    
    const mapped: Venue[] = rawData
      .filter((v) => v.coordinates && typeof v.coordinates.lat === 'number' && typeof v.coordinates.lng === 'number' && isFinite(v.coordinates.lat) && isFinite(v.coordinates.lng))
      .map((v) => ({
        id: v.id,
        name: v.name,
        category: v.categoryId,
        description: v.seoDescription || null,
        latitude: v.coordinates!.lat,
        longitude: v.coordinates!.lng,
        locationStr: v.location,
        tags: v.tags,
        priceRange: v.priceRange,
        vibe: v.vibe,
      }));

    setVenues(mapped);
  }, []);

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

  // Close panel if its venue gets hidden by filter or search
  useEffect(() => {
    if (
      selected &&
      (!matchesFilter(selected.category, activeFilter) ||
        !matchesSearch(selected, searchQuery))
    ) {
      setSelected(null);
    }
  }, [activeFilter, searchQuery, selected]);

  const handleFilterChange = useCallback((id: FilterId) => {
    setActiveFilter(id);
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    setSearchQuery(v);
  }, []);

  const handleMarkerClick = useCallback((venue: Venue) => {
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
              active={selected?.id === venue.id}
              onClick={() => handleMarkerClick(venue)}
            />
          </Marker>
        ))}
      </Map>

      {/* Side panel / bottom sheet */}
      <MapSidePanel venue={selected} onClose={handleClose} />
    </div>
  );
}
