import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, WifiOff, Star, Gem, Layers } from 'lucide-react';
import type { ExploreLocation } from '../types';

interface ExploreMapProps {
  locations: ExploreLocation[];
  onLocationSelect: (location: ExploreLocation) => void;
}

const UAE_CENTER: [number, number] = [54.3773, 24.4539];
const DEFAULT_ZOOM = 6;

const CATEGORY_COLORS: Record<string, string> = {
  landmark: '#C8A46B',
  'hidden-gem': '#8B5CF6',
  restaurant: '#F97316',
  'beach-club': '#06B6D4',
  'night-club': '#EC4899',
  'dining-entertainment': '#EAB308',
  nature: '#22C55E',
  viewpoint: '#3B82F6',
  culture: '#A855F7',
  adventure: '#EF4444',
  default: '#C8A46B',
};

function getCategoryColor(category?: string): string {
  if (!category) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.default;
}

function getMapboxToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMarkerEl(loc: ExploreLocation, animDelay: number): HTMLElement {
  const el = document.createElement('div');
  const isFeatured = loc.is_featured;
  const isHiddenGem = loc.is_hidden_gem;
  const color = getCategoryColor(loc.category);
  const size = isFeatured ? 16 : isHiddenGem ? 14 : 10;

  el.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:50%',
    `background:linear-gradient(135deg,${color},${color}dd)`,
    'border:2px solid #0B0B0C',
    'cursor:pointer',
    `box-shadow:0 0 0 2.5px ${color}45,0 2px 10px rgba(0,0,0,0.7)`,
    'transition:transform 0.2s ease,box-shadow 0.2s ease',
    'opacity:0',
    `animation:dalcMarkerIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) ${animDelay}ms both`,
    'position:relative',
    'display:flex',
    'align-items:center',
    'justify-content:center',
  ].join(';');

  if (isHiddenGem || isFeatured) {
    const ring = document.createElement('div');
    ring.style.cssText = [
      'position:absolute',
      'inset:-5px',
      'border-radius:50%',
      `border:1.5px solid ${color}70`,
      'animation:dalcGemPulse 2.2s ease-in-out infinite',
      'pointer-events:none',
    ].join(';');
    el.appendChild(ring);
  }

  if (isFeatured) {
    const starBg = document.createElement('div');
    starBg.innerHTML = `<svg width="8" height="8" viewBox="0 0 24 24" fill="${color}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    starBg.style.cssText = [
      'position:absolute',
      'top:-12px',
      'left:50%',
      'transform:translateX(-50%)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
    ].join(';');
    el.appendChild(starBg);
  }

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.7)';
    el.style.boxShadow = `0 0 0 4px ${color}55,0 4px 20px ${color}40`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.boxShadow = `0 0 0 2.5px ${color}45,0 2px 10px rgba(0,0,0,0.7)`;
  });

  return el;
}

function buildPopupHtml(loc: ExploreLocation): string {
  const color = getCategoryColor(loc.category);
  
  const featuredBadge = loc.is_featured
    ? `<div style="display:inline-flex;align-items:center;gap:4px;border-radius:100px;background:linear-gradient(135deg,${color},${color}dd);padding:3px 10px;margin-right:6px;">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#0a0800"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <span style="font-size:9px;font-weight:700;letter-spacing:0.1em;color:#0a0800;text-transform:uppercase;">Featured</span>
       </div>`
    : '';

  const gemBadge = loc.is_hidden_gem
    ? `<div style="display:inline-flex;align-items:center;gap:4px;border-radius:100px;border:1px solid rgba(139,92,246,0.5);background:rgba(139,92,246,0.15);padding:2px 8px;">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>
        <span style="font-size:9px;font-weight:700;letter-spacing:0.1em;color:#8B5CF6;text-transform:uppercase;">Hidden Gem</span>
       </div>`
    : '';

  const badges = (featuredBadge || gemBadge) 
    ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">${featuredBadge}${gemBadge}</div>` 
    : '';

  const heroImage = loc.hero_image
    ? `<div style="width:100%;height:100px;background:url('${esc(loc.hero_image)}') center/cover no-repeat;border-radius:10px 10px 0 0;position:relative;">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,#111214);"></div>
        ${loc.category ? `<div style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:3px 8px;">
          <span style="font-size:9px;font-weight:600;letter-spacing:0.12em;color:#fff;text-transform:uppercase;">${esc(loc.category)}</span>
        </div>` : ''}
       </div>`
    : '';

  const desc = loc.short_description
    ? `<p style="margin:4px 0 0;font-size:11px;color:#B6B6B6;line-height:1.45;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${esc(loc.short_description)}</p>`
    : '';

  const vibe = loc.vibe
    ? `<p style="margin:6px 0 0;font-size:10px;font-style:italic;color:${color};opacity:0.8;">"${esc(loc.vibe)}"</p>`
    : '';

  const locationInfo = loc.area || loc.emirate
    ? `<div style="display:flex;align-items:center;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05);">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B6B6B6" stroke-width="2"><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/></svg>
        <span style="font-size:10px;color:#B6B6B6;">${esc(loc.area || loc.emirate || '')}</span>
       </div>`
    : '';

  const hint = `<div style="margin-top:10px;display:flex;align-items:center;gap:4px;color:${color};opacity:0.7;font-size:10px;letter-spacing:0.04em;">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
    Click to view details
   </div>`;

  return `${heroImage}<div style="padding:${heroImage ? '10px' : '13px'} 13px 13px;">${badges}<h3 style="margin:0;font-size:14px;font-weight:600;color:#fff;font-family:'Playfair Display',serif;line-height:1.25;">${esc(loc.name)}</h3>${vibe}${desc}${locationInfo}${hint}</div>`;
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
      const el = buildMarkerEl(loc, Math.min(idx * 40, 600));

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
            NEXT_PUBLIC_MAPBOX_TOKEN
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

      {/* Legend */}
      {isLoaded && locations.length > 0 && (
        <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-[rgba(200,164,107,0.15)] bg-[#111214]/95 p-2.5 backdrop-blur-sm">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#B6B6B6]/60">
            <Layers className="h-3 w-3" />
            Legend
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS.landmark }} />
                <span className="text-[9px] text-[#B6B6B6]/70">Landmark</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS.restaurant }} />
                <span className="text-[9px] text-[#B6B6B6]/70">Restaurant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS['beach-club'] }} />
                <span className="text-[9px] text-[#B6B6B6]/70">Beach Club</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS['night-club'] }} />
                <span className="text-[9px] text-[#B6B6B6]/70">Nightlife</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-2.5 w-2.5 fill-[#C8A46B] text-[#C8A46B]" />
                <span className="text-[9px] text-[#B6B6B6]/70">Featured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gem className="h-2.5 w-2.5 text-[#8B5CF6]" />
                <span className="text-[9px] text-[#B6B6B6]/70">Hidden Gem</span>
              </div>
            </div>
          </div>
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
