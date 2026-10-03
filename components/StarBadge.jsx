// Badge in the top-right corner of a tour card image: "Top rated" on our best tours, five stars on the rest (no source names or numbers).
export default function StarBadge({ top }) {
  return <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-ink shadow" aria-label={top ? "Top rated" : "5 stars"}>{top ? <><span className="text-amber-500">★</span>Top rated</> : <span className="tracking-[.15em] text-amber-500">★★★★★</span>}</span>;
}
