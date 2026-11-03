import { destinations, destinationById } from '@/data/destinations';
import { BUDGET_TIERS, TRANSPORT_MODES, currentSeason } from '@/lib/constants';
import { haversineKm, roadDistanceKm, travelEstimate } from '@/lib/geo';

/**
 * Rule-based itinerary planner.
 *
 * Rules (all visible to the user in the UI):
 * 1. Score every destination on interest match, best season, group suitability
 *    and distance from your starting point.
 * 2. Greedily build each day from what is left, preferring the strongest score
 *    adjusted for the travel time from where you already are.
 * 3. Cap a day at three stops, ~6.5 hours of visiting and ~5.5 hours of travel.
 * 4. Add the return leg to the starting point, then price the trip.
 *
 * No live routing, no AI, no invented facts. Fees stay as text labels because
 * they are indicative; the budget uses an explicit daily allowance instead.
 */

const MAX_VISIT_MINUTES_PER_DAY = 430;
const MAX_TRAVEL_MINUTES_PER_DAY = 400;
const MAX_STOPS_PER_DAY = 3;

/**
 * The greedy pass produces one ordered travel sequence. This splits it into
 * days without re-ordering it, so each day stays on one side of the map, while
 * respecting the per-day visiting and travel caps.
 */
function seededNoise(key) {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

/**
 * Re-orders the chosen stops into a single nearest-neighbour path from the
 * starting point, so the drive never doubles back across the state.
 */
function orderByProximity(sequence, startCoords) {
  const remaining = [...sequence];
  const ordered = [];
  let cursor = startCoords;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    remaining.forEach((stop, index) => {
      const distance = haversineKm(cursor, stop.destination.coords);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    const [next] = remaining.splice(bestIndex, 1);
    ordered.push(next);
    cursor = next.destination.coords;
  }
  return ordered;
}

function buildDaysFromSequence(sequence, dayCount, startCoords, mode) {
  const target = Math.max(
    1,
    Math.min(MAX_STOPS_PER_DAY, Math.ceil(sequence.length / Math.max(1, dayCount)))
  );

  const built = [];
  let cursor = startCoords;
  let current = { stops: [], visit: 0, travel: 0 };

  sequence.forEach((stop) => {
    const estimate = travelEstimate(cursor, stop.destination.coords, mode);
    const overTravel = current.travel + estimate.minutes > MAX_TRAVEL_MINUTES_PER_DAY;
    const overVisit =
      current.visit + stop.destination.durationMinutes > MAX_VISIT_MINUTES_PER_DAY;
    const full = current.stops.length >= target;

    if (
      current.stops.length > 0 &&
      (full || overTravel || overVisit) &&
      built.length < dayCount - 1
    ) {
      built.push(current);
      current = { stops: [], visit: 0, travel: 0 };
    }

    current.stops.push(stop);
    current.visit += stop.destination.durationMinutes;
    current.travel += estimate.minutes;
    cursor = stop.destination.coords;
  });

  built.push(current);
  while (built.length < dayCount) built.push({ stops: [], visit: 0, travel: 0 });
  return built.map((day) => ({ stops: day.stops }));
}

export function budgetTierFor(budgetPerPerson, days) {
  const perDay = Number(budgetPerPerson) / Math.max(1, days);
  if (perDay < 2200) return BUDGET_TIERS[0];
  if (perDay < 5000) return BUDGET_TIERS[1];
  return BUDGET_TIERS[2];
}

export function generateItinerary(inputs) {
  const {
    startLabel,
    startCoords,
    days,
    travellers,
    budgetPerPerson,
    transportId,
    interests = [],
    groupType = 'Friends',
    picks = [],
    monthIndex = new Date().getMonth(),
    seed = 0,
  } = inputs;

  const season = currentSeason(monthIndex);
  const mode = TRANSPORT_MODES.find((m) => m.id === transportId) || TRANSPORT_MODES[0];
  const warnings = [];

  const scored = destinations
    .map((destination) => {
      const distanceFromStart = roadDistanceKm(startCoords, destination.coords);
      const interestHits = interests.length
        ? destination.categories.filter((c) => interests.includes(c)).length
        : 1;

      let score = interestHits * 14;
      if (picks.includes(destination.id)) score += 80;
      if (destination.seasons.includes(season)) score += 10;
      else score -= 7;
      if (season === 'Summer' && destination.categories.includes('Waterfalls')) score -= 18;
      if (groupType === 'Family' && destination.categories.includes('Adventure')) score -= 8;
      if (groupType === 'Family' && destination.durationMinutes <= 120) score += 4;
      if (groupType === 'Students' && destination.durationMinutes >= 240) score += 3;
      score -= Math.min(distanceFromStart, 700) / 55;
      // A deterministic, seeded nudge so "regenerate" produces a different but
      // still sensible plan instead of returning the identical list.
      score += seededNoise(`${destination.id}:${seed}`) * 13;

      return { destination, distanceFromStart, interestHits, score };
    })
    .sort((a, b) => b.score - a.score);

  const strictMatches = scored.filter(
    (item) => item.interestHits > 0 || picks.includes(item.destination.id)
  );
  const candidates = strictMatches.length >= days * 2 ? strictMatches : scored;

  if (interests.length && strictMatches.length < days * 2) {
    warnings.push(
      'Fewer places matched your interests than your trip needs, so the plan was widened to other categories.'
    );
  }

  let remaining = candidates;
  let cursor = startCoords;
  let cursorLabel = startLabel;
  const dayPlans = [];

  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    const stops = [];
    let visitMinutes = 0;
    let travelMinutes = 0;
    let guard = 0;

    while (remaining.length && stops.length < MAX_STOPS_PER_DAY && guard < 60) {
      guard += 1;

      const ranked = remaining
        .map((entry) => {
          const travel = travelEstimate(cursor, entry.destination.coords, mode);
          const proximityPenalty = (travel.minutes / 60) * 6;
          // Discourage absurd single legs: a 4-hour hop between stops wastes the day.
          const longLegPenalty = travel.minutes > 200 ? (travel.minutes - 200) * 0.35 : 0;
          const overflow =
            visitMinutes + entry.destination.durationMinutes > MAX_VISIT_MINUTES_PER_DAY;
          return {
            entry,
            travel,
            overflow,
            fitness: entry.score - proximityPenalty - longLegPenalty - (overflow ? 45 : 0),
          };
        })
        .sort((a, b) => b.fitness - a.fitness);

      const next = ranked[0];
      if (!next) break;

      const isFirstStop = stops.length === 0;
      if (!isFirstStop && next.overflow) break;
      if (!isFirstStop && travelMinutes + next.travel.minutes > MAX_TRAVEL_MINUTES_PER_DAY) break;

      stops.push({
        order: stops.length + 1,
        destination: next.entry.destination,
        fromLabel: cursorLabel,
        travelKm: next.travel.km,
        travelMinutes: next.travel.minutes,
        visitMinutes: next.entry.destination.durationMinutes,
      });

      visitMinutes += next.entry.destination.durationMinutes;
      travelMinutes += next.travel.minutes;
      cursor = next.entry.destination.coords;
      cursorLabel = next.entry.destination.name;
      remaining = remaining.filter(
        (item) => item.destination.id !== next.entry.destination.id
      );
    }

    if (stops.length === 0) {
      warnings.push('The curated list ran out of suitable stops — try fewer days or more interests.');
    }

    dayPlans.push({
      index: dayIndex + 1,
      stops,
      visitMinutes,
      travelMinutes,
      totalMinutes: visitMinutes + travelMinutes,
    });
  }

  const sequence = orderByProximity(dayPlans.flatMap((day) => day.stops), startCoords);
  const result = recalculate(
    buildDaysFromSequence(sequence, days, startCoords, mode),
    inputs
  );

  result.days.forEach((day) => {
    if (day.travelMinutes > 360) {
      warnings.push(
        `Day ${day.index} is a long driving day (about ${Math.round(day.travelMinutes / 60)} hours). Consider splitting it across two days.`
      );
    }
  });

  return { ...result, warnings: [...warnings, ...result.warnings], season };
}

/**
 * Recomputes every travel leg, day total, distance and budget from the current
 * stop order. Called after generation and after any remove / reorder / add.
 */
export function recalculate(days, inputs) {
  const mode = TRANSPORT_MODES.find((m) => m.id === inputs.transportId) || TRANSPORT_MODES[0];
  const warnings = [];

  let cursor = inputs.startCoords;
  let cursorLabel = inputs.startLabel;
  let totalKm = 0;
  let totalTravelMinutes = 0;
  let totalVisitMinutes = 0;
  let totalStops = 0;

  const rebuilt = days.map((day, dayIdx) => {
    let visitMinutes = 0;
    let travelMinutes = 0;

    const stops = day.stops
      .map((stop, stopIdx) => {
        const destination =
          typeof stop.destination === 'string'
            ? destinationById(stop.destination)
            : stop.destination;
        if (!destination) return null;

        const previousLabel = cursorLabel;
        const estimate = travelEstimate(cursor, destination.coords, mode);
        visitMinutes += destination.durationMinutes;
        travelMinutes += estimate.minutes;
        totalKm += estimate.km;
        totalTravelMinutes += estimate.minutes;
        totalVisitMinutes += destination.durationMinutes;
        totalStops += 1;
        cursor = destination.coords;
        cursorLabel = destination.name;

        return {
          ...stop,
          order: stopIdx + 1,
          destination,
          fromLabel: previousLabel,
          travelKm: estimate.km,
          travelMinutes: estimate.minutes,
          visitMinutes: destination.durationMinutes,
        };
      })
      .filter(Boolean);

    return {
      index: dayIdx + 1,
      stops,
      visitMinutes,
      travelMinutes,
      totalMinutes: visitMinutes + travelMinutes,
    };
  });

  const returnKm = totalStops > 0 ? roadDistanceKm(cursor, inputs.startCoords) : 0;
  const returnMinutes =
    totalStops > 0 ? travelEstimate(cursor, inputs.startCoords, mode).minutes : 0;
  totalKm += returnKm;
  totalTravelMinutes += returnMinutes;

  if (totalStops === 0) {
    warnings.push('There are no stops in this itinerary yet.');
  }

  const budget = computeBudget({
    days: rebuilt.length,
    totalKm,
    inputs,
  });

  return {
    days: rebuilt,
    stats: {
      totalStops,
      totalVisitMinutes,
      totalTravelMinutes,
      totalKm,
      returnKm,
      returnMinutes,
      modeLabel: mode.label,
      modeNote: mode.note,
      nights: Math.max(0, rebuilt.length - 1),
    },
    budget,
    warnings,
  };
}

export function computeBudget({ days, totalKm, inputs }) {
  const tier = budgetTierFor(inputs.budgetPerPerson, days);
  const travellers = Math.max(1, Number(inputs.travellers) || 1);
  const mode = TRANSPORT_MODES.find((m) => m.id === inputs.transportId) || TRANSPORT_MODES[0];

  const round10 = (v) => Math.round(v / 10) * 10;

  const vehicleCost = totalKm * mode.perKm;
  const transportPerPerson =
    mode.id === 'car' ? vehicleCost / travellers : vehicleCost;

  const nights = Math.max(0, days - 1);
  const stayPerPerson = nights * tier.stayPerNight;
  const foodPerPerson = days * tier.foodPerDay;
  const allowancePerPerson = days * tier.dailyBuffer;

  const lines = [
    {
      label: 'Transport',
      detail:
        mode.id === 'car'
          ? `${totalKm} km × ₹${mode.perKm}/km, split across ${travellers} travellers`
          : `${totalKm} km × ₹${mode.perKm}/km per person, ${mode.label.toLowerCase()}`,
      perPerson: round10(transportPerPerson),
    },
    {
      label: 'Stay',
      detail:
        nights === 0
          ? 'Day trip — no overnight stay counted'
          : `${nights} night${nights > 1 ? 's' : ''} × ₹${tier.stayPerNight.toLocaleString('en-IN')} (${tier.label} tier)`,
      perPerson: round10(stayPerPerson),
    },
    {
      label: 'Food',
      detail: `${days} day${days > 1 ? 's' : ''} × ₹${tier.foodPerDay} (${tier.label} tier)`,
      perPerson: round10(foodPerPerson),
    },
    {
      label: 'Entries & guides allowance',
      detail: `₹${tier.dailyBuffer} per day — tickets vary by site and are marked indicative`,
      perPerson: round10(allowancePerPerson),
    },
  ].map((line) => ({ ...line, total: line.perPerson * travellers }));

  const perPersonTotal = lines.reduce((sum, line) => sum + line.perPerson, 0);
  const tripTotal = perPersonTotal * travellers;
  const budgetTotal = (Number(inputs.budgetPerPerson) || 0) * travellers;

  return {
    lines,
    tier: tier.label,
    travellers,
    perPersonTotal,
    tripTotal,
    budgetPerPerson: Number(inputs.budgetPerPerson) || 0,
    budgetTotal,
    difference: budgetTotal - tripTotal,
    fits: tripTotal <= budgetTotal,
  };
}