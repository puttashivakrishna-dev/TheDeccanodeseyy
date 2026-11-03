import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORY_NAMES, SEASONS, TRIP_LENGTHS } from '@/lib/constants';

const SELECTS = [
  { key: 'district', label: 'District', all: 'All districts' },
  { key: 'category', label: 'Category', all: 'All categories' },
  { key: 'season', label: 'Best season', all: 'Any season' },
  { key: 'style', label: 'Trip style', all: 'Any length' },
  { key: 'sort', label: 'Sort by', all: null },
];

export default function FilterBar({ filters, districts, onChange, onClear, resultCount, total }) {
  const options = {
    district: districts,
    category: CATEGORY_NAMES,
    season: SEASONS.map((s) => s.name),
    style: TRIP_LENGTHS,
    sort: [
      { id: 'recommended', label: 'Recommended' },
      { id: 'name', label: 'Name (A–Z)' },
      { id: 'shortest', label: 'Shortest visit' },
      { id: 'longest', label: 'Longest visit' },
      { id: 'offbeat', label: 'Offbeat first' },
    ],
  };

  const isFiltered =
    filters.q ||
    filters.district !== 'all' ||
    filters.category !== 'all' ||
    filters.season !== 'all' ||
    filters.style !== 'all';

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="catalogue-search" className="sr-only">
            Search destinations
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="catalogue-search"
            type="search"
            value={filters.q}
            onChange={(e) => onChange('q', e.target.value)}
            placeholder="Search by name, district or interest…"
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-[14px] text-ink placeholder:text-muted-foreground/80 focus:border-clay/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {resultCount} of {total} places
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {SELECTS.map(({ key, label, all }) => {
          const list = options[key] || [];
          const value = filters[key];
          return (
            <div key={key} className="relative">
              <label htmlFor={`filter-${key}`} className="sr-only">
                {label}
              </label>
              <select
                id={`filter-${key}`}
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                className={`h-9 cursor-pointer appearance-none rounded-full border bg-background pl-4 pr-9 text-[12.5px] transition-colors focus:border-clay/50 focus:outline-none ${
                  value !== 'all'
                    ? 'border-clay/50 text-ink'
                    : 'border-border text-muted-foreground hover:text-ink'
                }`}
              >
                {all && <option value="all">{all}</option>}
                {list.map((item) => {
                  const id = typeof item === 'string' ? item : item.id;
                  const text = typeof item === 'string' ? item : item.label;
                  return (
                    <option key={id} value={id}>
                      {text}
                    </option>
                  );
                })}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="m2.5 4.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          );
        })}

        {isFiltered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-transparent px-3 text-[12.5px] text-clay transition-colors hover:bg-clay/10"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}