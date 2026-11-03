import { AlertCircle, ArrowRight, Loader2, X } from 'lucide-react';
import {
  CATEGORIES,
  GROUP_TYPES,
  MONTHS,
  MONTH_SEASON,
  START_CITIES,
  TRANSPORT_MODES,
} from '@/lib/constants';
import { destinationById } from '@/data/destinations';

export default function TripForm({ form, setForm, errors, onSubmit, picks, onRemovePick, generating }) {
  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInterest(name) {
    setForm((prev) => {
      const has = prev.interests.includes(name);
      if (has) return { ...prev, interests: prev.interests.filter((i) => i !== name) };
      if (prev.interests.length >= 4) return prev;
      return { ...prev, interests: [...prev.interests, name] };
    });
  }

  const season = MONTH_SEASON[form.monthIndex];

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-light text-ink">Trip brief</h2>
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Step 1 of 2
        </span>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="start-city" className="field-label">
            Starting city
          </label>
          <select
            id="start-city"
            value={form.startCityId}
            onChange={(e) => update('startCityId', e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[14px] text-ink focus:border-clay/50 focus:outline-none"
          >
            {START_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Travel estimates are measured from this city’s map position, not from your street
            address.
          </p>
        </div>

        <div>
          <label htmlFor="days" className="field-label">
            Number of days
          </label>
          <input
            id="days"
            type="number"
            inputMode="numeric"
            min={1}
            max={7}
            value={form.days}
            onChange={(e) => update('days', e.target.value)}
            aria-invalid={!!errors.days}
            className={`h-11 w-full rounded-xl border bg-background px-3.5 text-[14px] text-ink focus:outline-none ${
              errors.days ? 'border-destructive' : 'border-border focus:border-clay/50'
            }`}
          />
          {errors.days ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-destructive">
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              {errors.days}
            </p>
          ) : (
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">1 to 7 days.</p>
          )}
        </div>

        <div>
          <label htmlFor="travellers" className="field-label">
            Travellers
          </label>
          <input
            id="travellers"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={form.travellers}
            onChange={(e) => update('travellers', e.target.value)}
            aria-invalid={!!errors.travellers}
            className={`h-11 w-full rounded-xl border bg-background px-3.5 text-[14px] text-ink focus:outline-none ${
              errors.travellers ? 'border-destructive' : 'border-border focus:border-clay/50'
            }`}
          />
          {errors.travellers ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-destructive">
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              {errors.travellers}
            </p>
          ) : (
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              Transport is split across the group.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="budget" className="field-label">
            Budget per person (₹)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="budget"
              type="number"
              inputMode="numeric"
              min={500}
              step={500}
              value={form.budgetPerPerson}
              onChange={(e) => update('budgetPerPerson', e.target.value)}
              aria-invalid={!!errors.budgetPerPerson}
              className={`h-11 w-36 rounded-xl border bg-background px-3.5 text-[14px] text-ink focus:outline-none ${
                errors.budgetPerPerson ? 'border-destructive' : 'border-border focus:border-clay/50'
              }`}
            />
            {[2500, 5000, 10000, 18000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => update('budgetPerPerson', preset)}
                className={`h-9 rounded-full border px-3.5 text-[12px] transition-colors ${
                  Number(form.budgetPerPerson) === preset
                    ? 'border-clay/50 bg-clay/10 text-clay'
                    : 'border-border text-muted-foreground hover:text-ink'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          {errors.budgetPerPerson ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-destructive">
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              {errors.budgetPerPerson}
            </p>
          ) : (
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              For the whole trip, per person — not per day.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="group" className="field-label">
            Travelling as
          </label>
          <select
            id="group"
            value={form.groupType}
            onChange={(e) => update('groupType', e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[14px] text-ink focus:border-clay/50 focus:outline-none"
          >
            {GROUP_TYPES.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="month" className="field-label">
            Month of travel
          </label>
          <select
            id="month"
            value={form.monthIndex}
            onChange={(e) => update('monthIndex', Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[14px] text-ink focus:border-clay/50 focus:outline-none"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            {MONTHS[form.monthIndex]} is {season.toLowerCase()} — the planner weights places that
            suit it.
          </p>
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="field-label">Transport preference</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TRANSPORT_MODES.map((mode) => {
            const active = form.transportId === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => update('transportId', mode.id)}
                aria-pressed={active}
                className={`rounded-xl border p-3.5 text-left transition-all duration-300 ${
                  active
                    ? 'border-clay/60 bg-clay/[0.07]'
                    : 'border-border bg-background hover:border-clay/30'
                }`}
              >
                <span className="block text-[13px] font-medium text-ink">{mode.label}</span>
                <span className="mt-1 block text-[11.5px] leading-snug text-muted-foreground">
                  {mode.note}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="field-label">
          Interests <span className="font-normal text-muted-foreground">(up to four)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ name }) => {
            const active = form.interests.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleInterest(name)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-2 text-[12.5px] transition-colors ${
                  active
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-border text-muted-foreground hover:border-clay/40 hover:text-ink'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          {form.interests.length === 0
            ? 'Nothing selected — the planner will consider every category.'
            : `${form.interests.length} selected. Leave empty for a mixed trip.`}
        </p>
      </fieldset>

      {picks.length > 0 && (
        <div className="mt-7 rounded-xl border border-border bg-secondary/50 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Your shortlist — always included first
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {picks.map((id) => {
              const destination = destinationById(id);
              if (!destination) return null;
              return (
                <li key={id}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-ink">
                    {destination.name}
                    <button
                      type="button"
                      onClick={() => onRemovePick(id)}
                      aria-label={`Remove ${destination.name} from your shortlist`}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <button
          type="submit"
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-70"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Building your itinerary…
            </>
          ) : (
            <>
              Generate itinerary
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="max-w-xs text-[11.5px] leading-relaxed text-muted-foreground">
          Rule-based and local — no account, no credits, nothing sent anywhere.
        </p>
      </div>
    </form>
  );
}