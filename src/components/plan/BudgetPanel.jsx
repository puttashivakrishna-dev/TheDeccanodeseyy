import { Info, TriangleAlert } from 'lucide-react';
import { formatINR } from '@/lib/constants';

export default function BudgetPanel({ budget, stats }) {
  const usedPercent = budget.budgetTotal
    ? Math.min(100, Math.round((budget.tripTotal / budget.budgetTotal) * 100))
    : 0;

  return (
    <div className="print-plain rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-light text-ink">Indicative budget</h3>
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {budget.tier} tier
        </span>
      </div>

      <dl className="mt-5 space-y-3">
        {budget.lines.map((line) => (
          <div key={line.label} className="flex items-start justify-between gap-4">
            <div>
              <dt className="text-[13px] text-ink">{line.label}</dt>
              <dd className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{line.detail}</dd>
            </div>
            <dd className="shrink-0 text-right">
              <span className="block text-[13px] text-ink">{formatINR(line.perPerson)}</span>
              <span className="block text-[10.5px] text-muted-foreground">per person</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-muted-foreground">Per person total</span>
          <span className="font-display text-xl text-ink">{formatINR(budget.perPersonTotal)}</span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-[13px] text-muted-foreground">
            Whole group ({budget.travellers}{' '}
            {budget.travellers === 1 ? 'traveller' : 'travellers'})
          </span>
          <span className="text-[15px] font-medium text-ink">{formatINR(budget.tripTotal)}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
          <span>Against your budget of {formatINR(budget.budgetTotal)}</span>
          <span>{usedPercent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${
              budget.fits ? 'bg-forest' : 'bg-clay'
            }`}
            style={{ width: `${usedPercent}%` }}
            role="progressbar"
            aria-valuenow={usedPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Share of budget used"
          />
        </div>
        <p
          className={`mt-2.5 text-[12px] ${budget.fits ? 'text-forest' : 'text-clay'}`}
        >
          {budget.fits
            ? `Fits your budget with ${formatINR(budget.difference)} to spare.`
            : `This plan is ${formatINR(Math.abs(budget.difference))} over budget — try a leaner tier, fewer nights or public transport.`}
        </p>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
        <p className="flex gap-2">
          <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {stats.totalKm} km of driving is estimated from map positions — add 10–25% on hill roads.
        </p>
        <p className="flex gap-2">
          <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          Entry tickets are not included as fixed amounts because published fees vary by site and
          visitor category; they sit inside the daily allowance.
        </p>
      </div>
    </div>
  );
}