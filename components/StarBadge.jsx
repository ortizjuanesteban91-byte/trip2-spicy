// Badge top-right of a tour card image: "★ Top rated" on our best tours (kept as is), single compact "★ 4.9" on the rest (our TripAdvisor rating). No source names.
export default function StarBadge({ top }) {
  return <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-ink shadow" aria-label={top ? "Top rated" : "Rated 4.9 out of 5"}><span className="text-amber-500">★</span>{top ? "Top rated" : "4.9"}</span>;
}
