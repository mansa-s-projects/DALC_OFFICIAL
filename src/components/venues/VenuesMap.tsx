'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, WifiOff } from 'lucide-react';
import type { VenueItem } from '../../data/venues/venuesData';

interface VenuesMapProps {
  venues: (VenueItem & { categoryId: string })[];
  onVenueSelect?: (venue: VenueItem & { categoryId: string }) => void;
  selectedVenueId?: string;
}

const UAE_CENTER: [number, number] = [55.27, 25.20]; // Dubai city center
const DEFAULT_ZOOM = 11;

function getMapboxToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

// XSS-safe HTML string escaping for map popup content
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMarkerEl(isTrending: boolean, animDelay: number): HTMLElement {
  const el = document.createElement('div');
  const size = isTrending ? 14 : 10;

  el.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:50%',
    'background:linear-gradient(135deg,#D4B87A,#C8A46B)',
    'border:2px solid #0B0B0C',
    'cursor:pointer',
    'box-shadow:0 0 0 2.5px rgba(200,164,107,0.28),0 2px 10px rgba(0,0,0,0.7)',
    'transition:transform 0.2s ease,box-shadow 0.2s ease',
    'opacity:0',
    `animation:dalcMarkerIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) ${animDelay}ms both`,
    'position:relative',
    'display:flex',
    'align-items:center',
    'justify-content:center',
  ].join(';');

  if (isTrending) {
    const ring = document.createElement('div');
    ring.style.cssText = [
      'position:absolute',
      'inset:-5px',
      'border-radius:50%',
      'border:1.5px solid rgba(200,164,107,0.45)',
      'animation:dalcGemPulse 2.2s ease-in-out infinite',
      'pointer-events:none',
    ].join(';');
    el.appendChild(ring);
  }

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.7)';
    el.style.boxShadow = '0 0 0 4px rgba(200,164,107,0.35),0 4px 20px rgba(200,164,107,0.3)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.boxShadow = '0 0 0 2.5px rgba(200,164,107,0.28),0 2px 10px rgba(0,0,0,0.7)';
  });

  return el;
}

function buildPopupHtml(venue: VenueItem): string {
  const tags = venue.tags.slice(0, 2).map(t => esc(t)).join(' · ');
  
  return `<div style="padding:13px 15px;">
    <h3 style="margin:0;font-size:13px;font-weight:600;color:#fff;font-family:'Playfair Display',serif;line-height:1.25;">${esc(venue.name)}</h3>
    <p style="margin:4px 0 0;font-size:11px;color:#C8A46B;text-transform:uppercase;letter-spacing:0.05em;">${esc(venue.vibe)}</p>
    <p style="margin:6px 0 0;font-size:10px;color:#888;line-height:1.4;">${esc(venue.location)}</p>
    <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
      ${tags ? `<span style="font-size:9px;color:#666;">${tags}</span>` : ''}
    </div>
  </div>`;
}

// Inject global CSS for markers + popup once
const STYLE_ID = 'dalc-venues-map-global';
function ensureGlobalStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes dalcMarkerIn {
      from { opacity:0; transform:scale(0.3); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes dalcGemPulse {
      0%,100% { opacity:.55; transform:scale(1); }
      50%      { opacity:.1;  transform:scale(1.6); }
    }
    .dalc-popup .mapboxgl-popup-content {
      background:#111214 !important;
      border:1px solid rgba(200,164,107,0.35) !important;
      border-radius:14px !important;
      padding:0 !important;
      box-shadow:0 14px 45px rgba(0,0,0,0.65),0 0 22px rgba(200,164,107,0.07) !important;
      min-width:180px; max-width:220px;
      overflow:hidden;
    }
    .dalc-popup .mapboxgl-popup-close-button { display:none; }
    .dalc-popup.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip { border-top-color:rgba(200,164,107,0.35) !important; }
    .dalc-popup.mapboxgl-popup-anchor-top    .mapboxgl-popup-tip { border-bottom-color:rgba(200,164,107,0.35) !important; }
    .dalc-popup.mapboxgl-popup-anchor-left   .mapboxgl-popup-tip { border-right-color:rgba(200,164,107,0.35) !important; }
    .dalc-popup.mapboxgl-popup-anchor-right  .mapboxgl-popup-tip { border-left-color:rgba(200,164,107,0.35) !important; }
    .mapboxgl-ctrl-group { background:#111214 !important; border:1px solid rgba(200,164,107,0.2) !important; }
    .mapboxgl-ctrl-group button { background:#111214 !important; }
    .mapboxgl-ctrl-group button:hover { background:#1a1c1f !important; }
    .mapboxgl-ctrl-icon { filter: invert(1) !important; }
    .mapboxgl-ctrl-attrib { background:rgba(11,11,12,0.8) !important; }
    .mapboxgl-ctrl-attrib a { color:rgba(200,164,107,0.6) !important; }
  `;
  document.head.appendChild(s);
}

export default function VenuesMap({ venues, onVenueSelect, selectedVenueId }: VenuesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const onSelectRef = useRef(onVenueSelect);
  const [isLoaded, setIsLoaded] = useState(false);

  onSelectRef.current = onVenueSelect;

  const token = getMapboxToken();

  // Inject styles once
  useEffect(() => {
    ensureGlobalStyles();
  }, []);

  // Init map
  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: UAE_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      logoPosition: 'bottom-right',
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right',
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    map.on('load', () => setIsLoaded(true));
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
  }, [token]);

  // Sync markers whenever venues change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    // Shared reusable popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 18,
      className: 'dalc-popup',
      maxWidth: '220px',
    });
    popupRef.current = popup;

    // Only show venues with coordinates
    const venuesWithCoords = venues.filter(v => v.coordinates);

    venuesWithCoords.forEach((venue, idx) => {
      if (!venue.coordinates) return;
      
      const el = buildMarkerEl(venue.trending === true, Math.min(idx * 40, 600));

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([venue.coordinates.lng, venue.coordinates.lat])
        .addTo(mapRef.current!);

      el.addEventListener('mouseenter', () => {
        popup
          .setLngLat([venue.coordinates!.lng, venue.coordinates!.lat])
          .setHTML(buildPopupHtml(venue))
          .addTo(mapRef.current!);
      });

      el.addEventListener('mouseleave', () => {
        setTimeout(() => popup.remove(), 100);
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.remove();
        onSelectRef.current?.(venue);
        mapRef.current?.flyTo({
          center: [venue.coordinates!.lng, venue.coordinates!.lat],
          zoom: Math.max(mapRef.current.getZoom(), 13),
          duration: 950,
          essential: true,
        });
      });

      markersRef.current.push(marker);
    });

    // Auto-fit bounds to show all markers
    if (venuesWithCoords.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      venuesWithCoords.forEach(v => {
        if (v.coordinates) bounds.extend([v.coordinates.lng, v.coordinates.lat]);
      });
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14,
        duration: 1200,
      });
    }
  }, [venues, isLoaded]);

  // Fly to selected venue
  useEffect(() => {
    if (!mapRef.current || !selectedVenueId || !isLoaded) return;
    
    const venue = venues.find(v => v.id === selectedVenueId);
    if (venue?.coordinates) {
      mapRef.current.flyTo({
        center: [venue.coordinates.lng, venue.coordinates.lat],
        zoom: 14,
        duration: 1000,
        essential: true,
      });
    }
  }, [selectedVenueId, venues, isLoaded]);

  // No token state
  if (!token) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-[rgba(200,164,107,0.15)] bg-[#111214]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(200,164,107,0.15)] bg-[rgba(200,164,107,0.05)]">
          <WifiOff className="h-6 w-6 text-[#C8A46B]/40" />
        </div>
        <p className="text-sm font-semibold text-[#B6B6B6]/70">Map unavailable</p>
        <p className="max-w-[200px] text-center text-xs leading-relaxed text-[#B6B6B6]/40">
          Add{' '}
          <code className="rounded bg-[rgba(200,164,107,0.1)] px-1 py-0.5 font-mono text-[#C8A46B]/70">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{' '}
          to your .env file
        </p>
      </div>
    );
  }

  const venuesWithCoords = venues.filter(v => v.coordinates);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[rgba(200,164,107,0.12)]">
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#111214]">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#C8A46B]/20 border-t-[#C8A46B]" />
            <span className="text-sm text-[#B6B6B6]/55">Loading map…</span>
          </div>
        </div>
      )}

      {/* Marker count badge */}
      {isLoaded && venuesWithCoords.length > 0 && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-[rgba(200,164,107,0.22)] bg-[#111214]/90 px-3 py-1.5 backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-[#C8A46B]" />
          <span className="text-xs font-medium text-[#B6B6B6]">
            {venuesWithCoords.length} {venuesWithCoords.length === 1 ? 'venue' : 'venues'}
          </span>
        </div>
      )}

      {/* No results overlay */}
      {isLoaded && venuesWithCoords.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#111214]/60 backdrop-blur-sm">
          <p className="text-sm text-[#B6B6B6]/50">No venues with locations</p>
        </div>
      )}

      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
