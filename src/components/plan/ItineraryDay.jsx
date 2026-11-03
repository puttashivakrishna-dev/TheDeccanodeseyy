import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ExternalLink, Navigation, Trash2 } from 'lucide-react';
import { directionsLink } from '@/data/destinations';
import { formatDuration } from '@/lib/constants';

export default function ItineraryDay({ day, dayCount, onRemove, onMove }) {
  const lastIndex = day.stops.length - 1;

  return (
    <section className="print-break overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 bg-secondary/30 px-5 py-4">
        <h3 className="font-display text-lg text-ink">Day {day.index}</h3>
        <p className="text-[11.5px] text-muted-foreground">
          {day.stops.length} {day.stops.length === 1 ? 'stop' : 'stops'} ·{' '}
          {formatDuration(day.visitMinutes)} visiting · {formatDuration(day.travelMinutes)}{' '}
          travelling
          {dayCount > 1 && day.index < dayCount ? ' · overnight nearby' : ''}
        </p>
      </header>

      {day.stops.length === 0 ? (
        <p className="px-5 py-7 text-[13px] leading-relaxed text-muted-foreground">
          This day is empty. Regenerate the plan, or remove a day if you are travelling with fewer.
        </p>
      ) : (
        <ol className="divide-y divide-border/70">
          {day.stops.map((stop, index) => {
            const { destination } = stop;
            const hoursUnverified = destination.hours.status !== 'indicative';
            const feeUnverified = destination.fee.status !== 'indicative';

            return (
              <li key={`${destination.id}-${index}`} className="px-5 py-5">
                <div className="flex items-start gap-4">
                  <span className="mt-1 font-mono text-[11px] tracking-widest text-clay">
                    {String(stop.order).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] text-muted-foreground">
                      From {stop.fromLabel} · ≈{stop.travelKm} km ·{' '}
                      {formatDuration(stop.travelMinutes)}{' '}
                      <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]">
                        estimate
                      </span>
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <Link
                        to={`/destination/${destination.id}`}
                        className="font-display text-[17px] font-normal text-ink underline-offset-4 transition-colors hover:text-clay hover:underline"
                      >
                        {destination.name}
                      </Link>
                      <span className="text-[12px] text-muted-foreground">
                        {destination.district} · {destination.categories.join(', ')}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {destination.summary}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-ink/75">
                        Visit {formatDuration(stop.visitMinutes)}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 ${
                          hoursUnverified
                            ? 'border-border text-muted-foreground'
                            : 'border-gold/35 bg-gold/10 text-gold'
                        }`}
                        title={destination.hours.text || 'No reliable opening hours published'}
                      >
                        {hoursUnverified ? 'Hours not verified' : `Hours ${destination.hours.text}`}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 ${
                          feeUnverified
                            ? 'border-border text-muted-foreground'
                            : 'border-gold/35 bg-gold/10 text-gold'
                        }`}
                        title={destination.fee.text || 'No fee published'}
                      >
                        {feeUnverified ? 'Fee not verified' : destination.fee.text}
                      </span>
                      <a
                        href={directionsLink(`${stop.fromLabel}, Telangana`, destination)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="no-print inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-ink/75 transition-colors hover:border-clay/40 hover:text-clay"
                      >
                        <Navigation className="h-3 w-3" aria-hidden="true" />
                        Directions
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="no-print flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onMove(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${destination.name} earlier on day ${day.index}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(index, 1)}
                      disabled={index === lastIndex}
                      aria-label={`Move ${destination.name} later on day ${day.index}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      aria-label={`Remove ${destination.name} from day ${day.index}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}