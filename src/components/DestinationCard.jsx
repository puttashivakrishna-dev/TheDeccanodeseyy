import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import DestinationImage from '@/components/DestinationImage';
import { formatDuration } from '@/lib/constants';

export default function DestinationCard({ destination, layout = 'grid' }) {
  const tall = layout === 'tall';

  return (
    <Link
      to={`/destination/${destination.id}`}
      className="card-lift group flex flex-col overflow-hidden rounded-[calc(var(--radius)+4px)] border border-border/80 bg-card"
    >
      <div className="relative">
        <DestinationImage
          src={destination.image}
          alt={`${destination.name}, ${destination.district}`}
          className={tall ? 'aspect-[4/5] w-full' : 'aspect-[4/3] w-full'}
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm">
          {destination.categories[0]}
        </span>
        {destination.hiddenGem && (
          <span className="absolute right-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory">
            Hidden gem
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink">{destination.name}</h3>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {destination.district}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDuration(destination.durationMinutes)} · {destination.tripLength}
          </span>
        </div>

        <p className="text-[13.5px] leading-relaxed text-muted-foreground">{destination.summary}</p>
      </div>
    </Link>
  );
}