import { getReviews, GOOGLE_WRITE, TA_WRITE } from "@/lib/reviews";
const Stars = ({ n, cls = "" }) => <span className={`tracking-tight text-amber-400 ${cls}`} aria-label={`${n} out of 5`}>{"★".repeat(Math.round(n))}<span className="text-slate-300">{"★".repeat(5 - Math.round(n))}</span></span>;
const SRC = { Google: "bg-blue-50 text-blue-700", TripAdvisor: "bg-emerald-50 text-emerald-700", Direct: "bg-amber-50 text-amber-700", Other: "bg-slate-100 text-slate-600" };
const GoogleWord = () => <span className="text-xl font-extrabold tracking-tight" aria-label="Google"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>;
// Reviews "widget": rating summary card + swipeable review cards. Content comes only from /admin > Reviews.
export default async function Reviews() {
  const { items, tripadvisor, google, score, count } = await getReviews();
  if (!items.length && !(count > 0)) return null;
  return (
    <section className="bg-ice px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[11px] font-extrabold tracking-[.25em] text-brand/70">GUEST REVIEWS</p>
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-brand md:text-4xl">What our guests say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-[280px_1fr] md:items-stretch">
          {count > 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-lg ring-1 ring-sky-100">
              <GoogleWord />
              <p className="mt-3 text-6xl font-black leading-none text-ink">{score.toFixed(1)}</p>
              <Stars n={score} cls="mt-2 text-2xl" />
              <p className="mt-2 text-sm font-bold text-ink/60">{count} Google reviews</p>
              <a href={google} target="_blank" rel="noopener noreferrer" className="mt-4 w-full rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-brand ring-1 ring-sky-200 hover:bg-sky-50">Read all reviews ↗</a>
              <a href={GOOGLE_WRITE} target="_blank" rel="noopener noreferrer" className="mt-2 w-full rounded-full bg-brand px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-hover">Write a review ★</a>
              {tripadvisor && <a href={tripadvisor} target="_blank" rel="noopener noreferrer" className="mt-2 w-full rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50">See us on TripAdvisor ↗</a>}
              <a href={TA_WRITE} target="_blank" rel="noopener noreferrer" className="mt-2 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-emerald-700">Review us on TripAdvisor ★</a>
            </div>
          )}
          {items.length > 0 && (
            <div className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0 ${count > 0 ? "" : "md:col-span-2"}`} style={{ scrollbarWidth: "none" }} role="list" aria-label="Guest reviews">
              {items.slice(0, 12).map((r, i) => (
                <figure key={i} role="listitem" className="flex w-[82%] shrink-0 snap-start flex-col rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100 sm:w-[340px]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-lg font-extrabold text-white">{r.name.trim()[0]?.toUpperCase()}</span>
                    <div className="min-w-0"><p className="truncate font-extrabold text-ink">{r.name}</p><p className="truncate text-xs text-ink/55">{[r.country, r.date].filter(Boolean).join(" · ")}</p></div>
                    <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${SRC[r.source] || SRC.Other}`}>{r.source}</span>
                  </div>
                  <Stars n={r.stars} cls="mt-4 text-lg" />
                  <blockquote className="mt-2 line-clamp-6 text-sm leading-6 text-ink/80">{r.text}</blockquote>
                </figure>
              ))}
            </div>
          )}
        </div>
        {items.length > 1 && <p className="mt-2 text-center text-xs text-ink/50 md:text-right">Swipe for more →</p>}
      </div>
    </section>
  );
}
