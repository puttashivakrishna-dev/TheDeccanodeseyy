import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarDays,
  HardDrive,
  MapPin,
  Printer,
  TriangleAlert,
  Trash2,
} from 'lucide-react';
import { deleteTrip, getTrips, storageAvailable } from '@/lib/tripStore';
import { formatINR } from '@/lib/constants';

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTrips(getTrips());
    setLoaded(true);
  }, []);

  function handleDelete(id) {
    deleteTrip(id);
    setTrips(getTrips());
    setPendingDelete(null);
  }

  const canStore = storageAvailable();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Saved trips</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-ink">
            Your itineraries
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Reopen a plan to edit stops, print it, or copy a share link.
          </p>
        </div>
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-ivory transition-colors hover:bg-clay"
        >
          Plan a new trip
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-xl border border-border bg-card/70 p-4">
        <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-ink">Stored on this device only.</span> ExploreTelangana
          has no accounts, so trips are kept in this browser’s local storage. They are not synced,
          not visible to anyone else, and disappear if you clear site data. Use the share link on an
          itinerary to move it to another device.
        </p>
      </div>

      {!canStore && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-4">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-[12.5px] leading-relaxed text-ink/80">
            This browser is blocking local storage (often a private window). Trips cannot be saved
            until storage is available — share links still work.
          </p>
        </div>
      )}

      {loaded && trips.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
          <CalendarDays className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.4} aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl font-light text-ink">No saved trips yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            Generate an itinerary and press “Save trip”. It will appear here for you to reopen,
            edit, print or share.
          </p>
          <Link
            to="/plan"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-ivory transition-colors hover:bg-clay"
          >
            Start planning
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {trips.map((trip) => {
            const summary = trip.summary || {};
            const updated = new Date(trip.updatedAt || trip.createdAt);
            return (
              <li
                key={trip.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-[19px] leading-snug text-ink">{trip.name}</h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {trip.inputs?.startLabel || 'Unknown start'}
                      </span>
                      <span>
                        {summary.days || trip.days?.length || 1} days ·{' '}
                        {summary.stops ?? '—'} stops
                      </span>
                    </p>
                  </div>
                  {summary.tripTotal ? (
                    <div className="shrink-0 text-right">
                      <p className="text-[15px] font-medium text-ink">{formatINR(summary.tripTotal)}</p>
                      <p className="text-[10.5px] text-muted-foreground">indicative total</p>
                    </div>
                  ) : null}
                </div>

                <p className="mt-3 text-[11.5px] text-muted-foreground">
                  Updated{' '}
                  {updated.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Link
                    to={`/plan?trip=${trip.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-ivory transition-colors hover:bg-clay"
                  >
                    Open &amp; edit
                  </Link>
                  <Link
                    to={`/plan?trip=${trip.id}&print=1`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] text-ink transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    Print
                  </Link>

                  {pendingDelete === trip.id ? (
                    <span className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(trip.id)}
                        className="rounded-full bg-destructive px-3 py-2 text-[12px] font-medium text-white"
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="rounded-full border border-border px-3 py-2 text-[12px] text-muted-foreground"
                      >
                        Keep
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(trip.id)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}