/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */

import React from 'react';
import '@vis.gl/react-google-maps';

// Augment @vis.gl/react-google-maps with maps3d overloads not yet in its types
declare module '@vis.gl/react-google-maps' {
  export function useMapsLibrary(name: 'maps3d'): google.maps.Maps3DLibrary | null;
  export function useMapsLibrary(name: 'elevation'): google.maps.ElevationLibrary | null;
}

declare global {
  // Augment the maps3d namespace with methods missing from @types/google.maps 3.58
  namespace google.maps.maps3d {
    // FlyCameraTo options – not yet typed in 3.58
    interface FlyCameraToOptions {
      durationMillis: number;
      endCamera: {
        center: google.maps.LatLngAltitudeLiteral;
        range?: number;
        heading?: number;
        tilt?: number;
        roll?: number;
      };
    }

    // Augment the existing Map3DElement class with missing methods/properties
    interface Map3DElement {
      defaultUIHidden: boolean;
      flyCameraTo(options: FlyCameraToOptions): void;
    }

    // Augment Map3DElementOptions with missing properties
    interface Map3DElementOptions {
      defaultUIHidden?: boolean;
      mode?: string;
    }

    // Marker3DInteractiveElement not in 3.58 yet – declare it
    interface Marker3DInteractiveElementOptions {
      position?: google.maps.LatLngAltitudeLiteral | null;
      altitudeMode?: string;
      label?: string | null;
      title?: string;
      drawsWhenOccluded?: boolean;
    }
    interface Marker3DInteractiveElement extends HTMLElement {
      position?: google.maps.LatLngAltitudeLiteral | null;
      label?: string | null;
    }
  }

  // Augment Maps3DLibrary to include Marker3DInteractiveElement
  namespace google.maps {
    interface Maps3DLibrary {
      Marker3DInteractiveElement: new (
        options?: google.maps.maps3d.Marker3DInteractiveElementOptions
      ) => google.maps.maps3d.Marker3DInteractiveElement;
    }
  }

  // JSX intrinsic element for the custom HTML element <gmp-map-3d>
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          center?: google.maps.LatLngAltitudeLiteral | string;
          range?: number | string;
          heading?: number | string;
          tilt?: number | string;
          roll?: number | string;
          defaultUIHidden?: boolean | string;
          mode?: string;
          ref?: React.Ref<google.maps.maps3d.Map3DElement>;
        },
        HTMLElement
      >;
    }
  }
}

export {};
