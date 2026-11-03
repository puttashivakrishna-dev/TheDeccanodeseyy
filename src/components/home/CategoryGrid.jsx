import { Link } from 'react-router-dom';
import {
  Castle,
  Compass,
  Drama,
  Droplets,
  Flame,
  Landmark,
  Mountain,
  Trees,
  Waves,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { destinations } from '@/data/destinations';

const ICONS = {
  Nature: Trees,
  Waterfalls: Droplets,
  Heritage: Landmark,
  Temples: Flame,
  Forts: Castle,
  Lakes: Waves,
  Culture: Drama,
  Adventure: Compass,
};

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Explore by category</p>
          <h2 className="mt-3 max-w-lg font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light leading-tight text-ink">
            Eight ways into the Deccan
          </h2>
        </div>
        <p className="max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
          Filter the catalogue by what a place actually is — not by how it photographs.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map(({ name, blurb }) => {
          const Icon = ICONS[name] || Mountain;
          const count = destinations.filter((d) => d.categories.includes(name)).length;
          return (
            <Link
              key={name}
              to={`/explore?category=${encodeURIComponent(name)}`}
              className="group flex flex-col gap-6 rounded-2xl border border-border/80 bg-card/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:bg-card hover:shadow-[0_20px_44px_-30px_rgba(20,24,51,0.55)]"
            >
              <Icon
                className="h-5 w-5 text-clay transition-transform duration-500 group-hover:scale-110"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>
                <span className="block text-[14px] font-medium text-ink">{name}</span>
                <span className="mt-1 block text-[11.5px] leading-snug text-muted-foreground">
                  {blurb}
                </span>
                <span className="mt-2 block text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  {count} {count === 1 ? 'place' : 'places'}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}