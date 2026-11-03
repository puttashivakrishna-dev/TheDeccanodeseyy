import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Plus,
} from 'lucide-react';
import DestinationImage from '@/components/DestinationImage';
import DestinationCard from '@/components/DestinationCard';
import PracticalInfo from '@/components/detail/PracticalInfo';
import { destinationById, mapLink, nearbyFor } from '@/data/destinations';
import { formatDuration } from '@/lib/constants';
import { getPicks, togglePick } from '@/lib/tripStore';

export default function DestinationDetail() {
  const { id } = useParams();
  const destination = destinationById(id);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (destination) {
      setPicked(getPicks().includes(destination.id));
      document.title = `${destination.name}, ${destination.district} — ExploreTelangana`;
    }
    return () => {
      document.title = 'ExploreTelangana — The Deccan Odyssey';
    };
  }, [destination]);

  useEffect(() => {
    if (!destination) {
      const meta = document.createElement('meta');
      meta.name = 'prerender-status-code';
      meta.content = '404';
      document.head.appendChild(meta);
      return () => {
        document.head.removeChild(meta);
      };
    }
    return undefined;
  }, [destination]);

  if (!destination) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-4 font-display text-3xl font-light text-ink">
          That destination isn’t in the catalogue
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
          The link may be out of date. Browse the full catalogue to find somewhere to go instead.
        </p>
        <Link
          to="/explore"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors hover:bg-clay"
        >
          Browse destinations
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const nearby = nearbyFor(destination);

  function handleAddToTrip() {
    const next = togglePick(destination.id);
    setPicked(next.includes(destination.id));
  }

  return (
    <article className="pb-8">
      <div className="relative">
        <DestinationImage
          src={destination.image}
          alt={`${destination.name}, ${destination.district}`}
          className="h-[46vh] min-h-[320px] w-full sm:h-[56vh]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 sm:pb-12">
            <Link
              to="/explore"
              className="no-print inline-flex items-center gap-1.5 text-[12.5px] text-ivory/70 transition-colors hover:text-ivory"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All destinations
            </Link>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.05] text-ivory">
              {destination.name}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ivory/75">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {destination.district} district
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDuration(destination.durationMinutes)} suggested
              </span>
              <span>{destination.categories.join(' · ')}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="no-print -mt-6 flex flex-wrap items-center gap-3 sm:-mt-7">
          <a
            href={mapLink(destination)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-ivory shadow-lg transition-colors hover:bg-clay"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Open in Google Maps
            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={handleAddToTrip}
            aria-pressed={picked}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium shadow-lg transition-colors ${
              picked
                ? 'bg-forest text-ivory hover:bg-forest/90'
                : 'bg-ivory text-ink hover:bg-clay hover:text-ivory'
            }`}
          >
            {picked ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
            {picked ? 'Added to your trip' : 'Add to Trip'}
          </button>
          {picked && (
            <Link to="/plan" className="text-[12.5px] text-clay underline underline-offset-4">
              Open the planner
            </Link>
          )}
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-light italic leading-snug text-ink">
              {destination.tagline}
            </p>
            <p className="mt-6 text-[15px] leading-[1.8] text-ink/85">{destination.overview}</p>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-light text-ink">Why visit</h2>
              <ul className="mt-4 space-y-3">
                {destination.whyVisit.map((reason) => (
                  <li key={reason} className="flex gap-3 text-[14px] leading-relaxed text-ink/80">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <PracticalInfo destination={destination} />
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card/60 p-5">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                About this data
              </h2>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                This page combines a researched description with the travel metadata our planner
                uses. Hours and fees are marked <strong className="font-medium text-ink">indicative</strong>{' '}
                or <strong className="font-medium text-ink">not verified</strong> — we do not invent
                figures. The map position used for distance estimates is approximate; the Google
                Maps button searches for the place by name and district instead of a coordinate.
              </p>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                At a glance
              </h2>
              <dl className="mt-4 space-y-4 text-[13px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">District</dt>
                  <dd className="text-right text-ink">{destination.district}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Categories</dt>
                  <dd className="text-right text-ink">{destination.categories.join(', ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Visit length</dt>
                  <dd className="text-right text-ink">
                    {formatDuration(destination.durationMinutes)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Best months</dt>
                  <dd className="text-right text-ink">{destination.seasons.join(', ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Map reference</dt>
                  <dd className="text-right text-ink">Approximate</dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Address for your maps app
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/80">
                  {destination.mapQuery}
                </p>
              </div>
            </div>

            {nearby.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-light text-ink">Nearby attractions</h2>
                <ul className="mt-4 divide-y divide-border/80 border-y border-border/80">
                  {nearby.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/destination/${item.id}`}
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span>
                          <span className="block text-[13.5px] text-ink transition-colors group-hover:text-clay">
                            {item.name}
                          </span>
                          <span className="block text-[11.5px] text-muted-foreground">
                            {item.categories[0]} · {formatDuration(item.durationMinutes)}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {nearby.length > 0 && (
          <section className="no-print mt-20">
            <h2 className="font-display text-2xl font-light text-ink">Keep going from here</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.slice(0, 3).map((item) => (
                <DestinationCard key={item.id} destination={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}