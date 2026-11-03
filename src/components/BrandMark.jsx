import { Link } from 'react-router-dom';

export default function BrandMark({ compact = false, light = false }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3 rounded-md"
      aria-label="ExploreTelangana — home"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
          light ? 'border-ivory/40 bg-ivory/10' : 'border-ink/20 bg-ink/[0.03]'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5 4.5 20.5h15L12 3.5Z"
            stroke={light ? 'hsl(var(--ivory))' : 'hsl(var(--ink))'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M9 20.5V15a3 3 0 0 1 6 0v5.5" stroke="hsl(var(--clay))" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-[17px] tracking-tight ${light ? 'text-ivory' : 'text-ink'}`}
        >
          ExploreTelangana
        </span>
        {!compact && (
          <span
            className={`mt-1 block text-[10px] uppercase tracking-[0.3em] ${
              light ? 'text-ivory/60' : 'text-muted-foreground'
            }`}
          >
            The Deccan Odyssey
          </span>
        )}
      </span>
    </Link>
  );
}