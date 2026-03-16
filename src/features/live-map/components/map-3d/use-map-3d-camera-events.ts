import { useEffect, useRef } from 'react';
import { Map3DCameraProps } from './map-3d';

const cameraPropNames = ['center', 'range', 'heading', 'tilt', 'roll'] as const;

const DEFAULT_CAMERA_PROPS: Map3DCameraProps = {
  center: { lat: 0, lng: 0, altitude: 0 },
  range: 0,
  heading: 0,
  tilt: 0,
  roll: 0,
};

function addDomListener(
  el: HTMLElement,
  eventName: string,
  handler: () => void
) {
  el.addEventListener(eventName, handler);
  return () => el.removeEventListener(eventName, handler);
}

export function useMap3DCameraEvents(
  mapEl?: google.maps.maps3d.Map3DElement | null,
  onCameraChange?: (cameraProps: Map3DCameraProps) => void
) {
  const cameraPropsRef = useRef<Map3DCameraProps>(DEFAULT_CAMERA_PROPS);

  useEffect(() => {
    if (!mapEl) return;

    const cleanupFns: (() => void)[] = [];
    let updateQueued = false;

    for (const p of cameraPropNames) {
      const removeListener = addDomListener(mapEl, `gmp-${p}change`, () => {
        const newValue = mapEl[p];
        if (newValue == null) return;

        if (p === 'center') {
          cameraPropsRef.current.center = (
            newValue as google.maps.LatLngAltitude
          ).toJSON();
        } else {
          cameraPropsRef.current[p] = newValue as number;
        }

        if (onCameraChange && !updateQueued) {
          updateQueued = true;
          queueMicrotask(() => {
            updateQueued = false;
            onCameraChange(cameraPropsRef.current);
          });
        }
      });
      cleanupFns.push(removeListener);
    }

    return () => cleanupFns.forEach(fn => fn());
  }, [mapEl, onCameraChange]);
}
