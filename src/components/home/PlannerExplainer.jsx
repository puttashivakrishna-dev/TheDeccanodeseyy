import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Tell us where you are starting',
    body: 'Your starting city sets the first travel leg. Distances are estimated from map coordinates — they are not live traffic.',
  },
  {
    n: '02',
    title: 'Set days, travellers and budget',
    body: 'The planner scales stops per day, splits transport across the group and keeps the budget lines internally consistent.',
  },
  {
    n: '03',
    title: 'Choose interests and pace',
    body: 'Interest tags and transport mode change which stops are selected, the order you visit them in, and how much fits in a day.',
  },
  {
    n: '04',
    title: 'Edit everything afterwards',
    body: 'Remove a stop, move it earlier or later, regenerate the whole plan, then save, print or share the itinerary.',
  },
];

export default function PlannerExplainer() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">How the planner works</p>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light leading-tight text-ink">
            A transparent, rule-based trip planner
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
            There is no live routing service behind this, and no AI guessing. The planner applies a
            published set of rules to a curated destination list: interest match, best season,
            travel time between stops, and how long each visit needs. You can see every number it
            produces, and edit the result.
          </p>

          <div className="mt-7 space-y-3">
            <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-ink">Estimates, clearly labelled.</span> Travel
                times use straight-line distance with a road factor; entry fees and opening hours
                are marked indicative or unknown.
              </p>
            </div>
            <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-ink">Always check before you go.</span> Temple
                timings, dam releases and safari permits change with the season and cannot be
                confirmed from here.
              </p>
            </div>
          </div>

          <Link
            to="/plan"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors duration-300 hover:bg-clay"
          >
            Start planning
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="space-y-px overflow-hidden rounded-2xl border border-border bg-border/60">
          {STEPS.map((step) => (
            <li key={step.n} className="bg-card p-6">
              <div className="flex items-start gap-5">
                <span className="font-mono text-[11px] tracking-widest text-clay">{step.n}</span>
                <div>
                  <h3 className="font-display text-[17px] leading-snug text-ink">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}