/// <reference types="google.maps" />
import { Map3DCameraProps } from '../components/map-3d/map-3d';
import { lookAtWithPadding } from './look-at';

export interface MapMarker {
  position: { lat: number; lng: number; altitude: number };
  label: string;
  showLabel: boolean;
  id?: string;
  category?: string;
}

type MapControllerDependencies = {
  map: google.maps.maps3d.Map3DElement;
  maps3dLib: google.maps.Maps3DLibrary;
  elevationLib: google.maps.ElevationLibrary;
};

export class MapController {
  private map: google.maps.maps3d.Map3DElement;
  private maps3dLib: google.maps.Maps3DLibrary;
  private elevationLib: google.maps.ElevationLibrary;

  constructor(deps: MapControllerDependencies) {
    this.map = deps.map;
    this.maps3dLib = deps.maps3dLib;
    this.elevationLib = deps.elevationLib;
  }

  clearMap() {
    this.map.innerHTML = '';
  }

  addMarkers(markers: MapMarker[]) {
    for (const markerData of markers) {
      const marker = new this.maps3dLib.Marker3DInteractiveElement({
        position: markerData.position,
        altitudeMode: 'RELATIVE_TO_MESH',
        label: markerData.showLabel ? markerData.label : null,
        title: markerData.label,
        drawsWhenOccluded: true,
      });
      this.map.appendChild(marker as unknown as HTMLElement);
    }
  }

  flyTo(cameraProps: Map3DCameraProps) {
    this.map.flyCameraTo({
      durationMillis: 3000,
      endCamera: {
        center: {
          lat: cameraProps.center.lat,
          lng: cameraProps.center.lng,
          altitude: cameraProps.center.altitude,
        },
        range: cameraProps.range,
        heading: cameraProps.heading,
        tilt: cameraProps.tilt,
        roll: cameraProps.roll,
      },
    });
  }

  async frameEntities(
    entities: { position: { lat: number; lng: number } }[],
    padding: [number, number, number, number]
  ) {
    if (entities.length === 0) return;

    const elevator = new this.elevationLib.ElevationService();
    const cameraProps = await lookAtWithPadding(
      entities.map(e => e.position),
      elevator,
      0,
      padding
    );

    this.flyTo({
      center: {
        lat: cameraProps.lat,
        lng: cameraProps.lng,
        altitude: cameraProps.altitude,
      },
      range: cameraProps.range + 1000,
      heading: cameraProps.heading,
      tilt: cameraProps.tilt,
      roll: 0,
    });
  }
}
