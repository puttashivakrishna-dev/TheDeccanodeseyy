import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, SearchX } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import FilterBar from '@/components/explore/FilterBar';
import { destinations, districts } from '@/data/destinations';

const DEFAULTS = {
  q: '',
  district: 'all',
  category: 'all',
  season: 'all',
  style: 'all',
  sort: 'recommended',
};

export default function Explore() {
  const [params, setParams] = useSearchParams();

  const filters = {
    q: params.get('q') || DEFAULTS.q,
    district: params.get('district') || DEFAULTS.district,
    category: params.get('category') || DEFAULTS.category,
    season: params.get('season') || DEFAULTS.season,
    style: params.get('style') || DEFAULTS.style,
    sort: params.get('sort') || DEFAULTS.sort,
  };

  function onChange(key, value) {
    const next = new URLSearchParams(params);
    const isDefault = !value || value === 'all' || value === DEFAULTS[key];
    if (isDefault) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function clearAll() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const matched = destinations.filter((d) => {
      if (filters.district !== 'all' && d.district !== filters.district) return false;
      if (filters.category !== 'all' && !d.categories.includes(filters.category)) return false;
      if (filters.season !== 'all' && !d.seasons.includes(filters.season)) return false;
      if (filters.style !== 'all' && d.tripLength !== filters.style) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.overview.toLowerCase().includes(q) ||
        d.categories.some((c) => c.toLowerCase().includes(q))
      );
    });

    const sorted = [...matched];
    switch (filters.sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'shortest':
        sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case 'longest':
        sorted.sort((a, b) => b.durationMinutes - a.durationMinutes);
        break;
      case 'offbeat':
        sorted.sort((a, b) => Number(b.hiddenGem) - Number(a.hiddenGem));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            Number(b.hiddenGem) - Number(a.hiddenGem) ||
            a.name.localeCompare(b.name)
        );
    }
    return sorted;
  }, [filters.q, filters.district, filters.category, filters.season, filters.style, filters.sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">The catalogue</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-ink">
            Explore Telangana
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            {destinations.length} curated places across {districts.length} districts — forts,
            temples, reservoirs, waterfalls and the markets in between.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <FilterBar
          filters={filters}
          districts={districts}
          onChange={onChange}
          onClear={clearAll}
          resultCount={results.length}
          total={destinations.length}
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
          <SearchX className="h-7 w-7 text-muted-foreground" strokeWidth={1.4} aria-hidden="true" />
          <h2 className="mt-5 font-display text-2xl font-light text-ink">
            Nothing matches those filters
          </h2>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            {filters.season !== 'all'
              ? 'Season filters are strict here — a waterfall in summer is usually a dry rock face. Try clearing the season, or pick another interest.'
              : 'Try a broader search term, or clear a filter or two. Every place in the catalogue is real, so a district name always returns something.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-ivory transition-colors hover:bg-clay"
            >
              Clear all filters
            </button>
            <Link
              to="/plan"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] text-ink transition-colors hover:border-clay/40"
            >
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Let the planner choose
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}

      <p className="mt-12 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
        Opening hours and entry fees are indicative and change with season, festivals and
        maintenance. Each destination page marks anything we could not confirm.
      </p>
    </div>
  );
}