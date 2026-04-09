"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, type MapRef } from "react-map-gl/mapbox";
import type { MapLayerMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapSidePanel,
  getCategoryColor,
  type MapLocation,
} from "./MapSidePanel";
import { ALL_EXPLORE_LOCATIONS } from "@/explore/data/exploreLocations";
import {
  MapCategoryFilter,
  matchesFilter,
  type FilterId,
} from "./MapCategoryFilter";
import { MapSearchOverlay } from "./MapSearchOverlay";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const DUBAI_CENTER = {
  longitude: 55.2708,
  latitude: 25.2048,
  zoom: 10.5,
};

// ─── Layer specs (drawn directly on the GL canvas — no DOM overhead) ──────────

const clusterLayer = {
  id: "clusters",
  type: "circle" as const,
  filter: ["has", "point_count"],
  paint: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    "circle-color": "#C8A46B",
    "circle-radius": [
      "step",
      ["get", "point_count"],
      18,
      10,
      24,
      30,
      32,
    ] as unknown as number,
    "circle-stroke-width": 2,
    "circle-stroke-color": "rgba(201,168,76,0.35)",
    "circle-opacity": 0.92,
    /* eslint-enable @typescript-eslint/no-explicit-any */
  },
};

const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol" as const,
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 12,
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  },
  paint: {
    "text-color": "#080706",
  },
};

const venueLayer = {
  id: "venues",
  type: "circle" as const,
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      8,
      5,
      12,
      8,
      15,
      12,
    ] as unknown as number,
    "circle-color": ["get", "color"] as unknown as string,
    "circle-stroke-width": 1.5,
    "circle-stroke-color": "rgba(255,255,255,0.45)",
    "circle-opacity": 0.93,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesSearch(venue: MapLocation, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    venue.name.toLowerCase().includes(q) ||
    venue.category.toLowerCase().includes(q) ||
    venue.locationStr?.toLowerCase().includes(q) ||
    venue.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
    false
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveMapPage() {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(DUBAI_CENTER);
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const venues = useMemo(
    () =>
      ALL_EXPLORE_LOCATIONS.filter(
        (loc) =>
          isFinite(loc.latitude) &&
          isFinite(loc.longitude) &&
          loc.latitude !== 0 &&
          loc.longitude !== 0,
      ).map((loc) => {
        const tier = Math.max(
          0,
          Math.min(4, Math.floor(Number(loc.price_tier) || 0)),
        );
        return {
          id: loc.id,
          name: loc.name,
          category: loc.category,
          description: loc.long_description || loc.short_description,
          latitude: loc.latitude,
          longitude: loc.longitude,
          locationStr: `${loc.area}, ${loc.emirate}`,
          tags: loc.tags,
          priceRange: tier > 0 ? "AED " + "$".repeat(tier) : "AED -",
          vibe: loc.vibe,
          bestTime: loc.best_time,
          insiderTip: loc.insider_tip,
          detailHref: "/explore",
          requestHref: `/request?location=${encodeURIComponent(loc.name)}`,
          requestLabel: "Plan with Concierge",
        };
      }),
    [],
  );

  const visibleVenues = useMemo(
    () =>
      venues.filter(
        (v) =>
          matchesFilter(v.category, activeFilter) &&
          matchesSearch(v, searchQuery),
      ),
    [venues, activeFilter, searchQuery],
  );

  // GeoJSON fed directly into the Mapbox GL source — renders as a native layer
  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: visibleVenues.map((v) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [v.longitude, v.latitude] as [number, number],
        },
        properties: {
          id: v.id,
          color: getCategoryColor(v.category),
        },
      })),
    }),
    [visibleVenues],
  );

  const venueById = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        category: string;
        latitude: number;
        longitude: number;
        requestLabel: string;
      }
    > = {};
    for (const v of venues) {
      map[v.id] = v;
    }
    return map;
  }, [venues]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) {
        setSelected(null);
        return;
      }
      const f = features[0];

      // Cluster click → zoom in
      if (f.layer && f.layer.id === "clusters" && f.geometry.type === "Point") {
        const currentZoom = mapRef.current?.getMap().getZoom() ?? 10;
        mapRef.current?.flyTo({
          center: f.geometry.coordinates as [number, number],
          zoom: currentZoom + 3,
          duration: 500,
        });
        return;
      }

      // Individual venue click → open side panel
      const id = f.properties?.id as string | undefined;
      if (id) {
        const venue = venueById[id] ?? null;
        setSelected((prev) => (prev?.id === id ? null : venue));
      }
    },
    [venueById],
  );

  const handleClose = useCallback(() => setSelected(null), []);
  const handleFilterChange = useCallback(
    (id: FilterId) => setActiveFilter(id),
    [],
  );
  const handleSearchChange = useCallback((v: string) => setSearchQuery(v), []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Live Map
          </p>
          <p className="text-gray-400 text-sm">
            Map unavailable — set NEXT_PUBLIC_MAPBOX_TOKEN to enable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* Top gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center px-5 py-4"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              color: "#C8A46B",
              fontSize: 13,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "serif",
            }}
          >
            DALC
          </span>
          <span
            style={{
              width: 1,
              height: 14,
              background: "rgba(255,255,255,0.2)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Live Map
          </span>
          {venues.length > 0 && (
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.08em",
              }}
            >
              · {visibleVenues.length}/{venues.length}
            </span>
          )}
        </div>
      </div>

      <MapSearchOverlay value={searchQuery} onChange={handleSearchChange} />
      <MapCategoryFilter active={activeFilter} onChange={handleFilterChange} />

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        reuseMaps
        interactiveLayerIds={["venues", "clusters"]}
        onClick={handleMapClick}
      >
        <Source
          id="venues-source"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={13}
          clusterRadius={45}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...venueLayer} />
        </Source>
      </Map>

      <MapSidePanel venue={selected} onClose={handleClose} />
    </div>
  );
}
