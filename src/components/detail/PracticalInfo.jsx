import { Accessibility, Clock, Coins, HeartHandshake, ShieldAlert, Sun } from 'lucide-react';
import StatusBadge from '@/components/detail/StatusBadge';
import { formatDuration } from '@/lib/constants';

export default function PracticalInfo({ destination }) {
  const rows = [
    {
      icon: Sun,
      label: 'Best season',
      value: destination.seasons.join(' · '),
      note: destination.bestTime,
      status: null,
    },
    {
      icon: Clock,
      label: 'Suggested duration',
      value: `${formatDuration(destination.durationMinutes)} · ${destination.tripLength}`,
      note: 'A comfortable pace, excluding the drive there.',
      status: null,
    },
    {
      icon: Clock,
      label: 'Opening hours',
      value: destination.hours.text || 'No reliable hours published',
      note: destination.hours.text
        ? 'Timings shift with festivals and maintenance.'
        : 'Call the site or check with the district tourism office before travelling.',
      status: destination.hours.status,
    },
    {
      icon: Coins,
      label: 'Entry fee',
      value: destination.fee.text || 'Fee not published',
      note: destination.fee.text
        ? 'Tickets are often different for Indian and foreign visitors; camera charges are extra.'
        : 'We could not confirm a fee. Assume there may be one.',
      status: destination.fee.status,
    },
    {
      icon: Accessibility,
      label: 'Accessibility',
      value: destination.accessibility,
      note: null,
      status: 'unknown',
      hideBadge: true,
    },
    {
      icon: HeartHandshake,
      label: 'Local etiquette',
      value: destination.etiquette,
      note: null,
      status: null,
    },
    {
      icon: ShieldAlert,
      label: 'Safety notes',
      value: destination.safety,
      note: null,
      status: null,
    },
  ];

  return (
    <section aria-labelledby="practical-heading">
      <h2 id="practical-heading" className="font-display text-2xl font-light text-ink">
        Practical information
      </h2>
      <p className="mt-2 text-[12.5px] text-muted-foreground">
        Anything we could not confirm is labelled, rather than filled in with a guess.
      </p>

      <dl className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label + row.value} className="flex gap-3.5">
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-clay"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <dt className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {row.label}
                  {row.status && !row.hideBadge && <StatusBadge status={row.status} />}
                </dt>
                <dd className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{row.value}</dd>
                {row.note && (
                  <dd className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {row.note}
                  </dd>
                )}
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}