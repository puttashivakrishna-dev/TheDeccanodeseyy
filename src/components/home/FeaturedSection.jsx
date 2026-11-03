import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';

export default function FeaturedSection({
  eyebrow,
  title,
  description,
  items,
  actionLabel,
  actionTo,
  variant = 'grid',
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light leading-tight text-ink">
            {title}
          </h2>
        </div>
        <div className="flex items-end gap-6">
          {description && (
            <p className="hidden max-w-xs text-[13.5px] leading-relaxed text-muted-foreground sm:block">
              {description}
            </p>
          )}
          {actionTo && (
            <Link
              to={actionTo}
              className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-clay"
            >
              {actionLabel}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </div>

      {variant === 'rail' ? (
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          {items.map((d) => (
            <div key={d.id} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
              <DestinationCard destination={d} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d, index) => (
            <DestinationCard key={d.id} destination={d} layout={index === 0 ? 'tall' : 'grid'} />
          ))}
        </div>
      )}
    </section>
  );
}