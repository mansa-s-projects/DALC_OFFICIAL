import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// @ts-ignore – Vite handles CSS side-effect imports at build time
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, WifiOff } from 'lucide-react';
import type { ExploreLocation } from '../types';

interface ExploreMapProps {
  locations: ExploreLocation[];
  onLocationSelect: (location: ExploreLocation) => void;
}

const UAE_CENTER: [number, number] = [54.3773, 24.4539];
const DEFAULT_ZOOM = 6;

// XSS-safe HTML string escaping for map popup content
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMarkerEl(isHiddenGem: boolean, animDelay: number): HTMLElement {
  const el = document.createElement('div');
  const size = isHiddenGem ? 14 : 10;

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

  if (isHiddenGem) {
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

function buildPopupHtml(loc: ExploreLocation): string {
  const gemBadge = loc.is_hidden_gem
    ? `<div style="display:inline-flex;align-items:center;gap:4px;border-radius:100px;border:1px solid rgba(200,164,107,0.35);background:rgba(200,164,107,0.1);padding:2px 8px;margin-bottom:7px;">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="#C8A46B"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>
        <span style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#C8A46B;text-transform:uppercase;">Hidden Gem</span>
       </div>`
    : '';

  const desc = loc.short_description
    ? `<p style="margin:3px 0 0;font-size:12px;color:#B6B6B6;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${esc(loc.short_description)}</p>`
    : '';

  const hint = `<div style="margin-top:9px;display:flex;align-items:center;gap:4px;color:rgba(200,164,107,0.55);font-size:10px;letter-spacing:0.06em;">
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/></svg>
    Click to view details
   </div>`;

  return `<div style="padding:13px 15px;">${gemBadge}<h3 style="margin:0;font-size:13px;font-weight:600;color:#fff;font-family:'Playfair Display',serif;line-height:1.25;">${esc(loc.name)}</h3>${desc}${hint}</div>`;
}

// Inject global CSS for markers + popup once
const STYLE_ID = 'dalc-map-global';
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
      min-width:200px; max-width:240px;
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

export default function ExploreMap({ locations, onLocationSelect }: ExploreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const onSelectRef = useRef(onLocationSelect);
  const [isLoaded, setIsLoaded] = useState(false);

  onSelectRef.current = onLocationSelect;

  const token = (import.meta as any).env.VITE_MAPBOX_TOKEN as string | undefined;

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

  // Sync markers whenever filtered locations or map load state changes
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Clear
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    // Shared reusable popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 18,
      className: 'dalc-popup',
      maxWidth: '240px',
    });
    popupRef.current = popup;

    locations.forEach((loc, idx) => {
      const el = buildMarkerEl(loc.is_hidden_gem, Math.min(idx * 40, 600));

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(mapRef.current!);

      el.addEventListener('mouseenter', () => {
        popup
          .setLngLat([loc.longitude, loc.latitude])
          .setHTML(buildPopupHtml(loc))
          .addTo(mapRef.current!);
      });

      el.addEventListener('mouseleave', () => {
        setTimeout(() => popup.remove(), 100);
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.remove();
        onSelectRef.current(loc);
        mapRef.current?.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: Math.max(mapRef.current.getZoom(), 11),
          duration: 950,
          essential: true,
        });
      });

      markersRef.current.push(marker);
    });
  }, [locations, isLoaded]);

  // ── No token state ──
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
            VITE_MAPBOX_TOKEN
          </code>{' '}
          to your .env file
        </p>
      </div>
    );
  }

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
      {isLoaded && locations.length > 0 && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-[rgba(200,164,107,0.22)] bg-[#111214]/90 px-3 py-1.5 backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-[#C8A46B]" />
          <span className="text-xs font-medium text-[#B6B6B6]">
            {locations.length} {locations.length === 1 ? 'location' : 'locations'}
          </span>
        </div>
      )}

      {/* No results overlay */}
      {isLoaded && locations.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#111214]/60 backdrop-blur-sm">
          <p className="text-sm text-[#B6B6B6]/50">No locations match filters</p>
        </div>
      )}

      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
