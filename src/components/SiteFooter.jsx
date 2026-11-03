import { Link } from 'react-router-dom';
import BrandMark from '@/components/BrandMark';
import { CATEGORIES } from '@/lib/constants';

export default function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-ink/10 bg-ink text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark light />
          <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-ivory/65">
            A travel-discovery and itinerary-planning companion for Telangana — built for
            weekend trips, family outings and first visits to the Deccan.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.name}>
                <Link
                  to={`/explore?category=${encodeURIComponent(c.name)}`}
                  className="text-ivory/75 transition-colors hover:text-ivory"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">Plan</h4>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            <li>
              <Link to="/plan" className="text-ivory/75 transition-colors hover:text-ivory">
                Build an itinerary
              </Link>
            </li>
            <li>
              <Link to="/saved" className="text-ivory/75 transition-colors hover:text-ivory">
                Saved trips
              </Link>
            </li>
            <li>
              <Link to="/explore" className="text-ivory/75 transition-colors hover:text-ivory">
                All destinations
              </Link>
            </li>
            <li>
              <Link
                to="/explore?season=Monsoon"
                className="text-ivory/75 transition-colors hover:text-ivory"
              >
                Monsoon waterfalls
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">Good to know</h4>
          <p className="mt-4 text-[13px] leading-relaxed text-ivory/65">
            Opening hours, entry fees and travel times are indicative. Confirm locally before you
            travel — timings change with season, festivals and maintenance.
          </p>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-[12px] text-ivory/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>ExploreTelangana · The Deccan Odyssey</p>
          <p className="max-w-xl">
            Travel disclaimer: this planner produces rule-based estimates from straight-line
            distances, not live traffic or road data. Verify safaris, dam releases and temple
            timings with the relevant department before travelling.
          </p>
        </div>
      </div>
    </footer>
  );
}