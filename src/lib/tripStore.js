import { destinationById } from '@/data/destinations';

/**
 * Browser storage.
 *
 * This app has no accounts, so trips and shortlisted destinations live in
 * localStorage on this device and browser only. The UI tells the user this
 * plainly, and offers a share link that carries the whole plan in the URL.
 */

const TRIPS_KEY = 'exploretelangana.trips.v1';
const PICKS_KEY = 'exploretelangana.planPicks.v1';
const MAX_TRIPS = 30;

export function storageAvailable() {
  try {
    const probe = '__et_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function read(key, fallback) {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!storageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getTrips() {
  const trips = read(TRIPS_KEY, []);
  return Array.isArray(trips)
    ? [...trips].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    : [];
}

export function getTrip(id) {
  return getTrips().find((trip) => trip.id === id) || null;
}

export function saveTrip(trip) {
  const trips = getTrips();
  const now = new Date().toISOString();
  const existingIndex = trips.findIndex((t) => t.id === trip.id);

  const record = {
    ...trip,
    id: trip.id || `trip_${Date.now()}`,
    createdAt: trip.createdAt || now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    trips[existingIndex] = record;
  } else {
    trips.unshift(record);
  }

  const trimmed = trips.slice(0, MAX_TRIPS);
  const ok = write(TRIPS_KEY, trimmed);
  return ok ? record : null;
}

export function deleteTrip(id) {
  const trips = getTrips().filter((trip) => trip.id !== id);
  return write(TRIPS_KEY, trips);
}

export function getPicks() {
  const picks = read(PICKS_KEY, []);
  return Array.isArray(picks) ? picks.filter((id) => !!destinationById(id)) : [];
}

export function togglePick(id) {
  const picks = getPicks();
  const next = picks.includes(id) ? picks.filter((p) => p !== id) : [...picks, id];
  write(PICKS_KEY, next);
  return next;
}

export function removePick(id) {
  const next = getPicks().filter((p) => p !== id);
  write(PICKS_KEY, next);
  return next;
}

export function clearPicks() {
  write(PICKS_KEY, []);
  return [];
}

/* ---------------------------------------------------------------- sharing */

function toBase64(value) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  return decodeURIComponent(escape(atob(withPadding)));
}

export function encodePlan(inputs, days) {
  const payload = {
    v: 1,
    s: inputs.startLabel,
    c: inputs.startCoords,
    d: inputs.days,
    t: inputs.travellers,
    b: inputs.budgetPerPerson,
    m: inputs.transportId,
    i: inputs.interests,
    g: inputs.groupType,
    mo: inputs.monthIndex,
    n: inputs.name || 'Shared itinerary',
    p: days.map((day) => day.stops.map((stop) => stop.destination.id)),
  };
  return toBase64(JSON.stringify(payload));
}

export function decodePlan(code) {
  try {
    const payload = JSON.parse(fromBase64(code));
    if (!payload || payload.v !== 1 || !Array.isArray(payload.p)) return null;
    return {
      name: payload.n || 'Shared itinerary',
      inputs: {
        startLabel: payload.s,
        startCoords: payload.c,
        days: payload.d,
        travellers: payload.t,
        budgetPerPerson: payload.b,
        transportId: payload.m,
        interests: payload.i || [],
        groupType: payload.g,
        monthIndex: payload.mo,
      },
      days: payload.p.map((ids, index) => ({
        index: index + 1,
        stops: ids
          .map((id) => destinationById(id))
          .filter(Boolean)
          .map((destination) => ({ destination })),
      })),
    };
  } catch {
    return null;
  }
}