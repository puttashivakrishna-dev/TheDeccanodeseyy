import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { destinationsBySeason } from '@/data/destinations';
import { MONTHS, MONTH_SEASON, SEASONS } from '@/lib/constants';

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SeasonalPicks() {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const season = MONTH_SEASON[monthIndex];
  const picks = destinationsBySeason(season).slice(0, 4);
  const seasonInfo = SEASONS.find((s) => s.name === season);

  return (
    <section className="mt-20 border-y border-border bg-secondary/40 sm:mt-24">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Seasonal recommendations</p>
            <h2 className="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light leading-tight text-ink">
              Where Telangana is at its best in {MONTHS[monthIndex]}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Pick a month to see what it suits
          </div>
        </div>

        <div className="mt-8 flex gap-1.5 overflow-x-auto pb-2" role="group" aria-label="Choose a month">
          {SHORT.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setMonthIndex(index)}
              aria-pressed={index === monthIndex}
              className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] transition-colors duration-300 ${
                index === monthIndex
                  ? 'bg-ink text-ivory'
                  : 'border border-border bg-card text-muted-foreground hover:border-clay/40 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-5 max-w-2xl text-[13.5px] leading-relaxed text-ink/75">
          <span className="font-medium text-ink">{season} · {seasonInfo?.months}.</span>{' '}
          {seasonInfo?.blurb}
        </p>

        <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {picks.map((d) => (
            <li key={d.id} className="border-b border-border/70 last:border-0">
              <Link
                to={`/destination/${d.id}`}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="block font-display text-[17px] text-ink transition-colors group-hover:text-clay">
                    {d.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted-foreground">
                    {d.district} · {d.bestTime}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-clay"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to={`/explore?season=${encodeURIComponent(season)}`}
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-clay"
        >
          See every {season.toLowerCase()} destination
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}