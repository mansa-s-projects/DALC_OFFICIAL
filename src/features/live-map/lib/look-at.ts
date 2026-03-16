/// <reference types="google.maps" />

type Location = {
  lat: number;
  lng: number;
  alt?: number;
};

async function fetchElevation(
  lat: number,
  lng: number,
  elevator: google.maps.ElevationService
): Promise<number> {
  const locationRequest: google.maps.LocationElevationRequest = {
    locations: [{ lat, lng }],
  };
  try {
    const { results } = await elevator.getElevationForLocations(locationRequest);
    if (results && results[0]) {
      return results[0].elevation;
    }
  } catch (e) {
    console.error('Elevation service failed:', e);
  }
  return 0;
}

export async function lookAt(
  locations: Array<Location>,
  elevator: google.maps.ElevationService,
  heading = 0
) {
  const ALTITUDE = await fetchElevation(locations[0].lat, locations[0].lng, elevator);

  const degToRad = Math.PI / 180;

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  locations.forEach(loc => {
    if (loc.lat < minLat) minLat = loc.lat;
    if (loc.lat > maxLat) maxLat = loc.lat;
    if (loc.lng < minLng) minLng = loc.lng;
    if (loc.lng > maxLng) maxLng = loc.lng;
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  let sumAlt = 0, countAlt = 0;
  locations.forEach(loc => {
    sumAlt += ALTITUDE + (loc.alt ?? 0);
    countAlt++;
  });
  const lookAtAltitude = countAlt > 0 ? sumAlt / countAlt : 0;

  function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const dLat = (lat2 - lat1) * degToRad;
    const dLng = (lng2 - lng1) * degToRad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * degToRad) * Math.cos(lat2 * degToRad) * Math.sin(dLng / 2) ** 2;
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  let maxAngularDistance = 0;
  locations.forEach(loc => {
    const d = haversine(centerLat, centerLng, loc.lat, loc.lng);
    if (d > maxAngularDistance) maxAngularDistance = d;
  });

  const earthRadius = 6371000;
  const maxDistance = maxAngularDistance * earthRadius;
  const horizontalDistance = maxDistance * 2;

  const targetTiltDeg = 60;
  const verticalDistance = horizontalDistance / Math.tan(targetTiltDeg * degToRad);
  const slantRange = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);

  return {
    lat: centerLat,
    lng: centerLng,
    altitude: lookAtAltitude,
    range: slantRange,
    tilt: targetTiltDeg,
    heading,
  };
}

export async function lookAtWithPadding(
  locations: Array<Location>,
  elevator: google.maps.ElevationService,
  heading = 0,
  padding: [number, number, number, number] = [0, 0, 0, 0]
) {
  const ALTITUDE = await fetchElevation(locations[0].lat, locations[0].lng, elevator);

  const degToRad = Math.PI / 180;
  const earthRadius = 6371000;

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  locations.forEach(loc => {
    if (loc.lat < minLat) minLat = loc.lat;
    if (loc.lat > maxLat) maxLat = loc.lat;
    if (loc.lng < minLng) minLng = loc.lng;
    if (loc.lng > maxLng) maxLng = loc.lng;
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  let sumAlt = 0, countAlt = 0;
  locations.forEach(loc => {
    sumAlt += ALTITUDE + (loc.alt ?? 0);
    countAlt++;
  });
  const lookAtAltitude = countAlt > 0 ? sumAlt / countAlt : 0;

  function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const dLat = (lat2 - lat1) * degToRad;
    const dLng = (lng2 - lng1) * degToRad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * degToRad) * Math.cos(lat2 * degToRad) * Math.sin(dLng / 2) ** 2;
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  let maxAngularDistance = 0;
  locations.forEach(loc => {
    const d = haversine(centerLat, centerLng, loc.lat, loc.lng);
    if (d > maxAngularDistance) maxAngularDistance = d;
  });

  const [padTop, padRight, padBottom, padLeft] = padding;
  const visibleWidthFraction = 1 - padLeft - padRight;
  const visibleHeightFraction = 1 - padTop - padBottom;
  const scale = Math.max(1 / visibleWidthFraction, 1 / visibleHeightFraction);

  const maxDistance = maxAngularDistance * earthRadius;
  const contentHorizontalDistance = maxDistance * 2;
  const fullHorizontalDistance = contentHorizontalDistance * scale;

  const offsetX = (padLeft - padRight) / 2;
  const offsetY = (padTop - padBottom) / 2;

  const offsetGeoScreenX = offsetX * fullHorizontalDistance;
  const offsetGeoScreenY = offsetY * fullHorizontalDistance;

  const shiftVectorScreenMeters = {
    x: -offsetGeoScreenX,
    y: offsetGeoScreenY,
  };

  const headingRad = heading * degToRad;
  const cosH = Math.cos(headingRad);
  const sinH = Math.sin(headingRad);

  const shiftEastMeters = shiftVectorScreenMeters.x * cosH - shiftVectorScreenMeters.y * sinH;
  const shiftNorthMeters = shiftVectorScreenMeters.x * sinH + shiftVectorScreenMeters.y * cosH;

  const shiftLat = (shiftNorthMeters / earthRadius) * (180 / Math.PI);
  const shiftLng =
    (shiftEastMeters / (earthRadius * Math.cos(centerLat * degToRad))) * (180 / Math.PI);

  const targetTiltDeg = 60;
  const verticalDistance = fullHorizontalDistance / Math.tan(targetTiltDeg * degToRad);
  const slantRange = Math.sqrt(fullHorizontalDistance ** 2 + verticalDistance ** 2);

  return {
    lat: centerLat + shiftLat,
    lng: centerLng + shiftLng,
    altitude: lookAtAltitude,
    range: slantRange,
    tilt: targetTiltDeg,
    heading,
  };
}
