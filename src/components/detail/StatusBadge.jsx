const VARIANTS = {
  indicative: {
    label: 'Indicative',
    className: 'border-gold/35 bg-gold/10 text-gold',
    title: 'Widely published, but confirm before you travel',
  },
  unknown: {
    label: 'Not verified',
    className: 'border-border bg-muted text-muted-foreground',
    title: 'We could not confirm this — check with the site directly',
  },
  verified: {
    label: 'Verified',
    className: 'border-forest/30 bg-forest/10 text-forest',
    title: 'Confirmed for this dataset',
  },
};

export default function StatusBadge({ status = 'indicative' }) {
  const variant = VARIANTS[status] || VARIANTS.unknown;
  return (
    <span
      title={variant.title}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${variant.className}`}
    >
      {variant.label}
    </span>
  );
}