import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { destinations } from '@/data/destinations';

export default function DestinationSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return destinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.categories.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query]);

  function submit(event) {
    event.preventDefault();
    setOpen(false);
    navigate(query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : '/explore');
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      <form
        onSubmit={submit}
        role="search"
        className="flex w-full items-center gap-2 rounded-full bg-ivory p-1.5 shadow-[0_18px_40px_-24px_rgba(20,24,51,0.6)] transition-shadow focus-within:ring-2 focus-within:ring-clay/50 focus-within:ring-offset-2 focus-within:ring-offset-ink"
      >
        <label htmlFor="hero-search" className="sr-only">
          Search destinations
        </label>
        <Search className="ml-3 h-4 w-4 shrink-0 text-ink/40" aria-hidden="true" />
        <input
          id="hero-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search destinations, districts or interests"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="hero-search-results"
          className="h-10 w-full min-w-0 bg-transparent text-[14px] text-ink placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-ivory transition-colors hover:bg-clay"
        >
          Search
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>

      {open && query.trim() && (
        <div
          id="hero-search-results"
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          {results.length === 0 ? (
            <p className="px-5 py-4 text-[13px] text-muted-foreground">
              No destination matches “{query.trim()}”. Try a district name like Warangal, or an
              interest like waterfalls.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setQuery('');
                      navigate(`/destination/${d.id}`);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <span>
                      <span className="block text-[14px] text-ink">{d.name}</span>
                      <span className="block text-[12px] text-muted-foreground">
                        {d.district} · {d.categories.join(' · ')}
                      </span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}