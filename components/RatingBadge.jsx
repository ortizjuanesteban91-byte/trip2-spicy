// Trip2's real Google and TripAdvisor ratings (edited in /admin > Reviews) + trust line, shown on tour cards.
export default function RatingBadge({ rt }) {
  return (
    <div className="mt-2 grid gap-1 text-xs">
      {rt && (rt.count > 0 || rt.taCount > 0) && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-extrabold text-ink">
          {rt.count > 0 && <span><span className="text-amber-500">★</span> {rt.score.toFixed(1)} <span className="font-bold text-ink/60">Google ({rt.count})</span></span>}
          {rt.taCount > 0 && <span><span className="text-emerald-600">★</span> {rt.taScore.toFixed(1)} <span className="font-bold text-ink/60">TripAdvisor ({rt.taCount})</span></span>}
        </p>
      )}
      <p className="font-bold text-emerald-700">✓ Free cancellation <span className="text-ink/50">· Hotel pickup · Verified guide</span></p>
    </div>
  );
}
