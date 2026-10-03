// Compact rating pill, top-right of a tour card image: one star + number. Top tours show 5.0 (our Google rating), the rest 4.9 (our TripAdvisor rating). No source names.
export default function StarBadge({ top }) {
  const n = top ? "5.0" : "4.9";
  return <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-ink shadow" aria-label={`Rated ${n} out of 5`}><span className="text-amber-500">★</span>{n}</span>;
}
