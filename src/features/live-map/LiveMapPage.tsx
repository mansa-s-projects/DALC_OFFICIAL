/// <reference types="vite/client" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Map3D, Map3DCameraProps } from './components/map-3d';
import { MapController } from './lib/map-controller';
import { DALC_VENUES, VENUE_CATEGORIES, MapVenue } from './lib/venue-data';

// Next.js compatible env var access
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';

const DUBAI_VIEW: Map3DCameraProps = {
  center: { lat: 25.1845, lng: 55.2708, altitude: 0 },
  range: 45000,
  heading: 0,
  tilt: 55,
  roll: 0,
};

// ─── Inner component (needs Maps context) ──────────────────────────────────────
function MapScene() {
  const [map, setMap] = useState<google.maps.maps3d.Map3DElement | null>(null);
  const [viewProps, setViewProps] = useState<Map3DCameraProps>(DUBAI_VIEW);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCardVisible, setIsCardVisible] = useState(false);

  const maps3dLib = useMapsLibrary('maps3d');
  const elevationLib = useMapsLibrary('elevation');
  const mapController = useRef<MapController | null>(null);
  const mapRef = useRef<google.maps.maps3d.Map3DElement | null>(null);

  // Build controller once all libs + map element are ready
  useEffect(() => {
    if (map && maps3dLib && elevationLib) {
      mapController.current = new MapController({ map, maps3dLib, elevationLib });
    }
    return () => { mapController.current = null; };
  }, [map, maps3dLib, elevationLib]);

  // Filter venues
  const filteredVenues = DALC_VENUES.filter(v => {
    const matchCat = activeCategory === 'all' || v.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vibe_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Re-plot markers whenever filter changes
  useEffect(() => {
    if (!mapController.current) return;
    mapController.current.clearMap();
    mapController.current.addMarkers(
      filteredVenues.map(v => ({
        position: { lat: v.lat, lng: v.lng, altitude: 50 },
        label: v.name,
        showLabel: true,
        id: v.id,
        category: v.category,
      }))
    );
  }, [filteredVenues, maps3dLib]);

  // Fly to full Dubai view
  const flyToDubai = useCallback(() => {
    if (!mapController.current) return;
    mapController.current.flyTo(DUBAI_VIEW);
    setSelectedVenue(null);
    setIsCardVisible(false);
  }, []);

  // Fly to a venue
  const flyToVenue = useCallback((venue: MapVenue) => {
    if (!mapController.current) return;
    mapController.current.flyTo({
      center: { lat: venue.lat, lng: venue.lng, altitude: 100 },
      range: 600,
      heading: 45,
      tilt: 65,
      roll: 0,
    });
    setSelectedVenue(venue);
    setIsCardVisible(true);
  }, []);

  const getCategoryColor = (catId: string) =>
    VENUE_CATEGORIES.find(c => c.id === catId)?.color ?? '#C8A46B';

  const priceTierLabel = (tier: number) => Array(tier).fill('$').join('');

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* ── 3D MAP ──────────────────────────────────────────────────────────── */}
      <Map3D
        ref={mapRef}
        {...viewProps}
        onCameraChange={setViewProps}
      />

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3
                      bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        {/* Logo */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <span className="font-serif text-[#C8A46B] text-lg tracking-widest">DALC</span>
          <span className="text-white/30 text-xs tracking-[0.2em] uppercase">Dubai Map</span>
        </div>

        {/* Search */}
        <div className="pointer-events-auto flex-1 max-w-md mx-auto relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search venues, areas, vibes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-md
                       border border-white/15 text-white text-sm placeholder-white/35
                       outline-none focus:border-[#C8A46B]/50 transition"
          />
        </div>

        {/* Reset button */}
        <button
          onClick={flyToDubai}
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 px-3 py-2
                     rounded-full bg-white/10 backdrop-blur-md border border-white/15
                     text-white/70 text-xs hover:bg-[#C8A46B]/20 hover:border-[#C8A46B]/40
                     hover:text-[#C8A46B] transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 12a9 9 0 1 1 18 0A9 9 0 0 1 3 12zm9-4v4l3 3" />
          </svg>
          Dubai
        </button>
      </div>

      {/* ── CATEGORY FILTERS ────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20
                      flex items-center gap-2 px-4 py-2.5
                      bg-black/60 backdrop-blur-md rounded-2xl
                      border border-white/10">
        {VENUE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat.id ? cat.color + '22' : 'transparent',
              color: activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.50)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: activeCategory === cat.id ? cat.color + '60' : 'transparent',
            }}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <span
                className="ml-1.5 inline-flex items-center justify-center
                           w-4 h-4 rounded-full text-[9px] font-bold"
                style={{ background: cat.color + '33', color: cat.color }}
              >
                {filteredVenues.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── VENUE LIST PANEL (left sidebar) ─────────────────────────────────── */}
      <div className="absolute top-16 left-3 z-20 w-60
                      bg-black/65 backdrop-blur-md rounded-2xl border border-white/10
                      overflow-hidden flex flex-col"
           style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="px-3 py-2.5 border-b border-white/8 flex items-center justify-between">
          <span className="text-white/60 text-xs tracking-wider uppercase">
            {filteredVenues.length} venues
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white/70 text-xs"
            >
              clear
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {filteredVenues.map(venue => (
            <button
              key={venue.id}
              onClick={() => flyToVenue(venue)}
              className="w-full text-left px-3 py-2.5 hover:bg-white/5
                         border-b border-white/5 last:border-0 transition group"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: getCategoryColor(venue.category) }}
                />
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate
                                group-hover:text-[#C8A46B] transition">
                    {venue.name}
                  </p>
                  <p className="text-white/40 text-[10px] truncate mt-0.5">
                    {venue.area} · {priceTierLabel(venue.price_tier)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── SELECTED VENUE CARD ──────────────────────────────────────────────── */}
      {selectedVenue && (
        <div
          className="absolute bottom-20 right-4 z-20 w-72
                     bg-[#0d0d0f]/90 backdrop-blur-xl rounded-2xl
                     border border-white/10 overflow-hidden shadow-2xl
                     transition-all duration-300"
          style={{
            transform: isCardVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            opacity: isCardVisible ? 1 : 0,
          }}
        >
          {/* Hero image */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={selectedVenue.hero_image}
              alt={selectedVenue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
            <button
              onClick={() => { setSelectedVenue(null); setIsCardVisible(false); }}
              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full
                         bg-black/50 backdrop-blur flex items-center justify-center
                         text-white/60 hover:text-white transition"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Category badge */}
            <span
              className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: getCategoryColor(selectedVenue.category) + '25',
                color: getCategoryColor(selectedVenue.category),
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: getCategoryColor(selectedVenue.category) + '50',
              }}
            >
              {selectedVenue.subcategory ?? selectedVenue.category}
            </span>
          </div>

          {/* Card body */}
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-white font-semibold text-sm leading-tight">{selectedVenue.name}</h3>
              <span className="text-[#C8A46B] text-xs font-mono shrink-0 mt-0.5">
                {priceTierLabel(selectedVenue.price_tier)}
              </span>
            </div>
            <p className="text-white/50 text-xs mt-0.5">{selectedVenue.area}</p>
            <p className="text-white/65 text-[11px] mt-2 leading-relaxed line-clamp-2">
              {selectedVenue.description}
            </p>

            {/* Vibe tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedVenue.vibe_tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-white/6
                             text-white/45 text-[10px] border border-white/8"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              href={`/venue/${selectedVenue.id}`}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2
                         rounded-xl bg-[#C8A46B]/15 border border-[#C8A46B]/30
                         text-[#C8A46B] text-xs font-medium
                         hover:bg-[#C8A46B]/25 transition"
            >
              View Venue
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* ── STATS BAR (top-right) ─────────────────────────────────────────────── */}
      <div className="absolute top-16 right-3 z-20
                      bg-black/60 backdrop-blur-md rounded-xl border border-white/10 px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[#C8A46B] text-sm font-bold">{DALC_VENUES.length}</p>
            <p className="text-white/40 text-[9px] uppercase tracking-wider">Total</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white text-sm font-bold">{filteredVenues.length}</p>
            <p className="text-white/40 text-[9px] uppercase tracking-wider">Shown</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-[#C8A46B] text-sm font-bold">DXB</p>
            <p className="text-white/40 text-[9px] uppercase tracking-wider">City</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Outer component with API provider ────────────────────────────────────────
export default function LiveMapPage() {
  return (
    <div className="fixed inset-0 z-0 bg-black" style={{ paddingTop: 0 }}>
      <APIProvider
        apiKey={MAPS_API_KEY}
        version="beta"
        libraries={['maps3d']}
      >
        <MapScene />
      </APIProvider>
    </div>
  );
}
