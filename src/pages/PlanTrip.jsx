import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Check,
  Copy,
  Info,
  Printer,
  RefreshCw,
  Route as RouteIcon,
  Save,
  Share2,
  TriangleAlert,
} from 'lucide-react';
import TripForm from '@/components/plan/TripForm';
import ItineraryDay from '@/components/plan/ItineraryDay';
import BudgetPanel from '@/components/plan/BudgetPanel';
import { START_CITIES, formatDuration, formatINR } from '@/lib/constants';
import { generateItinerary, recalculate } from '@/lib/planner';
import {
  decodePlan,
  encodePlan,
  getPicks,
  getTrip,
  removePick,
  saveTrip,
} from '@/lib/tripStore';
import { routeLink } from '@/data/destinations';

const DEFAULT_FORM = {
  startCityId: 'hyderabad',
  days: 2,
  travellers: 2,
  budgetPerPerson: 5000,
  transportId: 'car',
  interests: [],
  groupType: 'Friends',
  monthIndex: new Date().getMonth(),
  seed: 0,
};

function validate(values) {
  const errors = {};
  const days = Number(values.days);
  const travellers = Number(values.travellers);
  const budget = Number(values.budgetPerPerson);

  if (!Number.isFinite(days) || days < 1 || days > 7) {
    errors.days = 'Choose between 1 and 7 days.';
  }
  if (!Number.isFinite(travellers) || travellers < 1 || travellers > 20) {
    errors.travellers = 'Enter between 1 and 20 travellers.';
  }
  if (!Number.isFinite(budget) || budget < 500) {
    errors.budgetPerPerson = 'Enter at least ₹500 per person.';
  }
  return errors;
}

function formFromInputs(inputs) {
  const city = START_CITIES.find((c) => c.label === inputs.startLabel);
  return {
    startCityId: city?.id || 'hyderabad',
    days: inputs.days,
    travellers: inputs.travellers,
    budgetPerPerson: inputs.budgetPerPerson,
    transportId: inputs.transportId || 'car',
    interests: inputs.interests || [],
    groupType: inputs.groupType || 'Friends',
    monthIndex: inputs.monthIndex ?? new Date().getMonth(),
    seed: 0,
  };
}

function daysFromRecord(record) {
  return (record.days || []).map((day) => ({
    stops: (day.stops || []).map((stop) => ({ destination: stop.destinationId })),
  }));
}

function defaultTripName(plan) {
  const stops = plan.stats.totalStops;
  return `${plan.inputs.startLabel} · ${plan.days.length} day${plan.days.length > 1 ? 's' : ''} · ${stops} stops`;
}

export default function PlanTrip() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [picks, setPicks] = useState([]);
  const [tripName, setTripName] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [sharedMode, setSharedMode] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setPicks(getPicks());

    const shareCode = params.get('plan');
    const tripId = params.get('trip');

    if (shareCode) {
      const decoded = decodePlan(shareCode);
      if (decoded) {
        const rebuilt = recalculate(decoded.days, decoded.inputs);
        setPlan({ ...rebuilt, inputs: decoded.inputs });
        setForm(formFromInputs(decoded.inputs));
        setTripName(decoded.name || 'Shared itinerary');
        setSharedMode(true);
      } else {
        setNotice({
          type: 'error',
          text: 'That share link could not be read. Ask the sender for a fresh link.',
        });
      }
    } else if (tripId) {
      const trip = getTrip(tripId);
      if (trip) {
        const rebuilt = recalculate(daysFromRecord(trip), trip.inputs);
        setPlan({ ...rebuilt, inputs: trip.inputs });
        setForm(formFromInputs(trip.inputs));
        setTripName(trip.name);
        setSavedId(trip.id);
        if (params.get('print') === '1') {
          window.setTimeout(() => window.print(), 700);
        }
      } else {
        setNotice({ type: 'error', text: 'That saved trip is not on this device any more.' });
      }
    }
    // Runs once on mount: the query string is the entry point for saved/shared trips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runGeneration(values) {
    const city = START_CITIES.find((c) => c.id === values.startCityId) || START_CITIES[0];
    const inputs = {
      startLabel: city.label,
      startCoords: city.coords,
      days: Number(values.days),
      travellers: Number(values.travellers),
      budgetPerPerson: Number(values.budgetPerPerson),
      transportId: values.transportId,
      interests: values.interests,
      groupType: values.groupType,
      monthIndex: Number(values.monthIndex),
      picks,
      seed: values.seed || 0,
      name: tripName,
    };
    const result = generateItinerary(inputs);
    setPlan({ ...result, inputs });
    setSavedId(null);
    setSharedMode(false);
    setShareUrl('');
    setNotice(null);
  }

  function handleSubmit(event) {
    event?.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setGenerating(true);
    window.setTimeout(() => {
      runGeneration(form);
      setGenerating(false);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 220);
  }

  function regenerate() {
    const nextSeed = (form.seed || 0) + 1;
    const nextForm = { ...form, seed: nextSeed };
    setForm(nextForm);
    runGeneration(nextForm);
  }

  function applyDays(nextDays) {
    const recalced = recalculate(nextDays, plan.inputs);
    setPlan((prev) => ({ ...prev, ...recalced }));
    setNotice(null);
  }

  function removeStop(dayIndex, stopIndex) {
    const nextDays = plan.days.map((day, index) =>
      index === dayIndex
        ? { ...day, stops: day.stops.filter((_, i) => i !== stopIndex) }
        : day
    );
    applyDays(nextDays);
  }

  function moveStop(dayIndex, stopIndex, direction) {
    const nextDays = plan.days.map((day, index) => {
      if (index !== dayIndex) return day;
      const target = stopIndex + direction;
      if (target < 0 || target >= day.stops.length) return day;
      const stops = [...day.stops];
      [stops[stopIndex], stops[target]] = [stops[target], stops[stopIndex]];
      return { ...day, stops };
    });
    applyDays(nextDays);
  }

  function handlePickRemove(id) {
    setPicks(removePick(id));
  }

  function handleSave() {
    if (!plan) return;
    const name = tripName.trim() || defaultTripName(plan);
    const record = saveTrip({
      id: savedId || undefined,
      name,
      inputs: plan.inputs,
      days: plan.days.map((day) => ({
        stops: day.stops.map((stop) => ({ destinationId: stop.destination.id })),
      })),
      summary: {
        days: plan.days.length,
        stops: plan.stats.totalStops,
        travellers: plan.budget.travellers,
        tripTotal: plan.budget.tripTotal,
        perPersonTotal: plan.budget.perPersonTotal,
        km: plan.stats.totalKm,
      },
    });

    if (record) {
      setSavedId(record.id);
      setTripName(record.name);
      setNotice({ type: 'success', text: 'Saved on this device. Open Saved Trips to reopen it.' });
    } else {
      setNotice({
        type: 'error',
        text: 'This browser blocked local storage, so the trip could not be saved. The itinerary is still on screen.',
      });
    }
  }

  async function handleShare() {
    const code = encodePlan({ ...plan.inputs, name: tripName.trim() || defaultTripName(plan) }, plan.days);
    const url = `${window.location.origin}/plan?plan=${code}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setNotice({ type: 'success', text: 'Share link copied — it carries the whole itinerary.' });
    } catch {
      setNotice({
        type: 'error',
        text: 'The browser blocked clipboard access. Copy the link shown below instead.',
      });
    }
  }

  const allStops = plan ? plan.days.flatMap((day) => day.stops) : [];
  const tripRoute =
    allStops.length > 0
      ? routeLink(
          `${plan.inputs.startLabel}, Telangana`,
          allStops.map((stop) => stop.destination.mapQuery)
        )
      : null;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Plan my trip</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-ink">
          Build a trip that fits the days you have
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Tell the planner where you are starting, how long you have and what you want to see. It
          returns a day-by-day schedule with travel estimates, editable stops and a budget built
          from visible numbers.
        </p>
      </div>

      {sharedMode && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-clay/30 bg-clay/[0.06] p-4">
          <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
          <p className="text-[12.5px] leading-relaxed text-ink/80">
            You are viewing a <strong className="font-medium text-ink">shared itinerary</strong>. Edits
            stay on screen — save it here to keep your own copy.
          </p>
        </div>
      )}

      {notice && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
            notice.type === 'success'
              ? 'border-forest/30 bg-forest/[0.07]'
              : 'border-destructive/30 bg-destructive/[0.06]'
          }`}
          role="status"
        >
          {notice.type === 'success' ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          )}
          <p className="text-[12.5px] leading-relaxed text-ink/80">{notice.text}</p>
        </div>
      )}

      <div className="no-print mt-8">
        <TripForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleSubmit}
          picks={picks}
          onRemovePick={handlePickRemove}
          generating={generating}
        />
      </div>

      <div ref={resultsRef} className="mt-16 scroll-mt-24">
        {!plan ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <RouteIcon className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.4} aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-light text-ink">No itinerary yet</h2>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Fill in the brief above and generate a plan. Everything it produces is editable —
              remove stops, reorder them, and regenerate for a different mix.
            </p>
          </div>
        ) : (
          <div>
            <div className="hidden print:block">
              <h1 className="font-display text-2xl text-ink">
                {tripName.trim() || defaultTripName(plan)}
              </h1>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {plan.inputs.startLabel} · {plan.days.length} days · {plan.budget.travellers}{' '}
                travellers · {formatINR(plan.budget.tripTotal)} total (indicative)
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Step 2 of 2 · your itinerary</p>
                <h2 className="mt-2 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light leading-tight text-ink">
                  {plan.days.length} day{plan.days.length > 1 ? 's' : ''} from{' '}
                  {plan.inputs.startLabel}
                </h2>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {plan.stats.totalStops} stops · {formatDuration(plan.stats.totalVisitMinutes)}{' '}
                  visiting · {formatDuration(plan.stats.totalTravelMinutes)} travelling · ≈
                  {plan.stats.totalKm} km
                </p>
              </div>

              <div className="no-print flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={regenerate}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Share link
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  Print
                </button>
                {tripRoute && (
                  <a
                    href={tripRoute}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[12.5px] text-ivory transition-colors hover:bg-clay"
                  >
                    <RouteIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Open full route
                  </a>
                )}
              </div>
            </div>

            {shareUrl && (
              <div className="no-print mt-5 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
                <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.target.select()}
                  aria-label="Shareable itinerary link"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-ink/70 focus:outline-none"
                />
              </div>
            )}

            <div className="mt-6 rounded-xl border border-gold/30 bg-gold/[0.07] p-4">
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-gold">
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  Read before you travel
                </p>
                <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-ink/75">
                  <li>
                    Travel times are estimates from straight-line map distance and average speeds
                    for {plan.stats.modeLabel.toLowerCase()} — not live traffic or real road routing.
                  </li>
                  <li>
                    Opening hours and fees marked “indicative” or “not verified” were not confirmed
                    for your date. Check with the site before you set out.
                  </li>
                  {plan.warnings.filter((w) => !w.includes('no stops')).map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-5">
                {plan.days.map((day) => (
                  <ItineraryDay
                    key={day.index}
                    day={day}
                    dayCount={plan.days.length}
                    onRemove={(stopIndex) => removeStop(day.index - 1, stopIndex)}
                    onMove={(stopIndex, direction) => moveStop(day.index - 1, stopIndex, direction)}
                  />
                ))}

                {plan.stats.totalStops > 0 && (
                  <p className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-4 text-[12.5px] text-muted-foreground">
                    Return to {plan.inputs.startLabel}: ≈{plan.stats.returnKm} km ·{' '}
                    {formatDuration(plan.stats.returnMinutes)}{' '}
                    <span className="text-[11px]">(estimate, included in the budget)</span>
                  </p>
                )}
              </div>

              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <BudgetPanel budget={plan.budget} stats={plan.stats} />

                <div className="no-print rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-xl font-light text-ink">Save this trip</h3>
                  <label htmlFor="trip-name" className="field-label mt-4">
                    Trip name
                  </label>
                  <input
                    id="trip-name"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder={defaultTripName(plan)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[13.5px] text-ink placeholder:text-muted-foreground/70 focus:border-clay/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-ivory transition-colors hover:bg-clay"
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                    {savedId ? 'Update saved trip' : 'Save trip'}
                  </button>
                  <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    Saved in this browser only. It will not follow you to another device, and
                    clearing site data removes it.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}