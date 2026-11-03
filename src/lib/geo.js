/**
 * Travel estimates.
 *
 * We do NOT have a routing service on this plan, so every distance here is a
 * documented approximation: great-circle distance between two approximate map
 * positions, multiplied by a road factor, then converted to time using the
 * average speed for the chosen transport mode plus a break allowance.
 * Nothing here is live traffic data and the UI says so.
 */

const ROAD_FACTOR = 1.28;
const EARTH_RADIUS_KM = 6371;

export function haversineKm(from, to) {
  const toRad = (value) => (value * Math.PI) / 180;
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function roadDistanceKm(from, to) {
  if (!from || !to) return 0;
  return Math.max(1, Math.round(haversineKm(from, to) * ROAD_FACTOR));
}

export function travelEstimate(from, to, mode) {
  const km = roadDistanceKm(from, to);
  const speed = mode?.speed || 45;
  const buffer = mode?.bufferMinutes ?? 10;
  const rawMinutes = (km / speed) * 60 + buffer;
  const minutes = Math.max(5, Math.round(rawMinutes / 5) * 5);
  return {
    km,
    minutes,
    basis: `≈${km} km road distance at ~${speed} km/h plus ${buffer} min of breaks`,
  };
}