export const CATEGORIES = [
  { name: 'Nature', blurb: 'Forests, hills and wildlife' },
  { name: 'Waterfalls', blurb: 'Monsoon cascades' },
  { name: 'Heritage', blurb: 'Palaces, museums and old cities' },
  { name: 'Temples', blurb: 'Living shrines and temple towns' },
  { name: 'Forts', blurb: 'Hill citadels and battlements' },
  { name: 'Lakes', blurb: 'Reservoirs and quiet shorelines' },
  { name: 'Culture', blurb: 'Bazaars, crafts and cuisine' },
  { name: 'Adventure', blurb: 'Trekking, safaris and theme parks' },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const SEASONS = [
  { name: 'Winter', months: 'November – February', blurb: 'Cool, dry and clear. The best months for forts, temples and long drives.' },
  { name: 'Summer', months: 'March – June', blurb: 'Hot afternoons. Lakes, wildlife parks and early-morning starts work best.' },
  { name: 'Monsoon', months: 'July – October', blurb: 'Waterfalls at full flow, green hills, and slippery fort steps.' },
];

export const MONTH_SEASON = [
  'Winter', 'Winter', 'Summer', 'Summer', 'Summer', 'Summer',
  'Monsoon', 'Monsoon', 'Monsoon', 'Monsoon', 'Winter', 'Winter',
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const TRIP_LENGTHS = ['Short stop', 'Half day', 'Full day'];

export const START_CITIES = [
  { id: 'hyderabad', label: 'Hyderabad', coords: [17.385, 78.4867] },
  { id: 'secunderabad', label: 'Secunderabad', coords: [17.4399, 78.4983] },
  { id: 'warangal', label: 'Warangal', coords: [17.9689, 79.5941] },
  { id: 'karimnagar', label: 'Karimnagar', coords: [18.4386, 79.1288] },
  { id: 'nizamabad', label: 'Nizamabad', coords: [18.6725, 78.094] },
  { id: 'khammam', label: 'Khammam', coords: [17.2473, 80.1514] },
  { id: 'nalgonda', label: 'Nalgonda', coords: [17.0575, 79.2684] },
  { id: 'adilabad', label: 'Adilabad', coords: [19.664, 78.532] },
  { id: 'mahabubnagar', label: 'Mahabubnagar', coords: [16.7488, 77.985] },
  { id: 'bengaluru', label: 'Bengaluru', coords: [12.9716, 77.5946] },
  { id: 'chennai', label: 'Chennai', coords: [13.0827, 80.2707] },
  { id: 'mumbai', label: 'Mumbai', coords: [19.076, 72.8777] },
  { id: 'pune', label: 'Pune', coords: [18.5204, 73.8567] },
  { id: 'vijayawada', label: 'Vijayawada', coords: [16.5062, 80.648] },
  { id: 'nagpur', label: 'Nagpur', coords: [21.1458, 79.0882] },
  { id: 'delhi', label: 'Delhi', coords: [28.6139, 77.209] },
];

export const TRANSPORT_MODES = [
  {
    id: 'car',
    label: 'Car / taxi',
    note: 'Fastest on highways. Fuel and tolls split across the group.',
    speed: 48,
    perKm: 9,
    bufferMinutes: 10,
  },
  {
    id: 'bike',
    label: 'Bike',
    note: 'Flexible on hill roads, slower on long highway stretches.',
    speed: 42,
    perKm: 5,
    bufferMinutes: 15,
  },
  {
    id: 'public',
    label: 'Public transport',
    note: 'Bus and train timings add waiting time; last-mile needs an auto.',
    speed: 33,
    perKm: 2.2,
    bufferMinutes: 45,
  },
  {
    id: 'flexible',
    label: 'Flexible mix',
    note: 'Averages car and bus speeds — useful if you will decide on the day.',
    speed: 42,
    perKm: 6,
    bufferMinutes: 20,
  },
];

export const GROUP_TYPES = ['Solo', 'Friends', 'Couple', 'Family', 'Students'];

export const BUDGET_TIERS = [
  { id: 'lean', label: 'Lean', stayPerNight: 850, foodPerDay: 450, dailyBuffer: 200 },
  { id: 'balanced', label: 'Balanced', stayPerNight: 1500, foodPerDay: 650, dailyBuffer: 300 },
  { id: 'comfort', label: 'Comfortable', stayPerNight: 3200, foodPerDay: 1000, dailyBuffer: 550 },
];

export const CURRENCY = '₹';

export function formatINR(value) {
  const rounded = Math.round(Number(value) || 0);
  return `${CURRENCY}${rounded.toLocaleString('en-IN')}`;
}

export function formatDuration(minutes) {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m} min`;
  const hours = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export function currentSeason(monthIndex = new Date().getMonth()) {
  return MONTH_SEASON[monthIndex] || 'Winter';
}