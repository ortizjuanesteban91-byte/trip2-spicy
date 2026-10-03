// Trust badge in the top-right corner of a tour card image (no numbers).
export default function StarBadge() {
  return <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-ink shadow"><span className="text-amber-500">★</span>Top rated</span>;
}
