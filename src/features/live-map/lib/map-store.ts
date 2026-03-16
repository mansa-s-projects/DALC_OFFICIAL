import { create } from 'zustand';
import { Map3DCameraProps } from '../components/map-3d/map-3d';

export interface MapMarker {
  position: { lat: number; lng: number; altitude: number };
  label: string;
  showLabel: boolean;
  id?: string;
  category?: string;
}

export const useMapStore = create<{
  markers: MapMarker[];
  cameraTarget: Map3DCameraProps | null;
  selectedVenueId: string | null;
  setMarkers: (markers: MapMarker[]) => void;
  clearMarkers: () => void;
  setCameraTarget: (target: Map3DCameraProps | null) => void;
  setSelectedVenueId: (id: string | null) => void;
}>(set => ({
  markers: [],
  cameraTarget: null,
  selectedVenueId: null,
  setMarkers: markers => set({ markers }),
  clearMarkers: () => set({ markers: [] }),
  setCameraTarget: target => set({ cameraTarget: target }),
  setSelectedVenueId: id => set({ selectedVenueId: id }),
}));
