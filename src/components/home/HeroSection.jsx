import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DestinationImage from '@/components/DestinationImage';
import DestinationSearch from '@/components/home/DestinationSearch';
import { destinations, districts } from '@/data/destinations';
import { CATEGORIES } from '@/lib/constants';
import { HERO_IMAGE } from '@/data/destinationImages';

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <DestinationImage
          src={HERO_IMAGE}
          alt="Kakatiya stone temple on the Telangana plains at golden hour"
          className="h-full w-full"
          imageClassName="animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/60 to-ink/92" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col px-5 pb-16 pt-20 sm:px-8 sm:pt-24 lg:pb-24 lg:pt-32">
        <p className="animate-fade-rise text-[11px] font-medium uppercase tracking-[0.3em] text-sand/85">
          Telangana · The Deccan Odyssey
        </p>

        <h1 className="animate-fade-rise mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.4rem)] font-light leading-[1.02] text-ivory">
          Your next great journey begins in{' '}
          <span className="italic text-sand">Telangana</span>.
        </h1>

        <p className="animate-fade-rise mt-6 max-w-xl text-[15px] leading-relaxed text-ivory/75">
          Forts on granite hills, Kakatiya stone carving, waterfalls that only run three months a
          year. Find where to go, when to go, and how long it actually takes to get there.
        </p>

        <div className="animate-fade-rise mt-9">
          <DestinationSearch />
        </div>

        <div className="animate-fade-rise mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors duration-300 hover:bg-ivory hover:text-ink"
          >
            Plan My Trip
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-ivory/35 px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/10"
          >
            Browse all destinations
          </Link>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-y-6 border-t border-ivory/15 pt-8 sm:grid-cols-4">
          {[
            { k: 'Curated places', v: destinations.length },
            { k: 'Districts covered', v: districts.length },
            { k: 'Interest categories', v: CATEGORIES.length },
            { k: 'Planning cost', v: 'Free' },
          ].map((stat) => (
            <div key={stat.k}>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">{stat.k}</dt>
              <dd className="mt-1.5 font-display text-2xl text-ivory">{stat.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}