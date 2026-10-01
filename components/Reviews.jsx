import { getReviews, GOOGLE_WRITE, TA_WRITE } from "@/lib/reviews";
const Stars = ({ n, cls = "" }) => <span className={`tracking-tight text-amber-400 ${cls}`} aria-label={`${n} out of 5`}>{"★".repeat(Math.round(n))}<span className="text-white/25">{"★".repeat(5 - Math.round(n))}</span></span>;
const SRC = { Google: ["G", "bg-[#4285F4]"], TripAdvisor: ["T", "bg-emerald-600"], Direct: ["✓", "bg-gold"], Other: ["★", "bg-slate-500"] };
const GoogleWord = ({ cls = "text-2xl" }) => <span className={`${cls} font-extrabold tracking-tight`} aria-label="Google"><span className="text-[#8ab4f8]">G</span><span className="text-[#f28b82]">o</span><span className="text-[#fdd663]">o</span><span className="text-[#8ab4f8]">g</span><span className="text-[#81c995]">l</span><span className="text-[#f28b82]">e</span></span>;
// Reviews widget: dark premium band, rating summary (Google + TripAdvisor) and swipeable review cards. Content only from /admin > Reviews.
export default async function Reviews() {
  const { items, tripadvisor, google, score, count, taScore, taCount } = await getReviews();
  const hasTA = taScore > 0 && taCount > 0;
  if (!items.length && !(count > 0) && !hasTA) return null;
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#04262b] via-[#073a41] to-[#0b5f66] px-5 py-20 text-white md:py-24">
      <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[11px] font-extrabold tracking-[.3em] text-gold">GUEST REVIEWS</p>
        <h2 className="mt-2 text-center text-4xl font-black tracking-tight md:text-5xl">Loved by travelers from everywhere</h2>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-stretch justify-center gap-3">
          {count > 0 && (
            <a href={google} target="_blank" rel="noopener noreferrer" className="flex min-w-[220px] flex-1 items-center gap-4 rounded-3xl bg-white/10 px-6 py-4 ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15">
              <p className="text-5xl font-black leading-none">{score.toFixed(1)}</p>
              <div className="leading-tight"><GoogleWord /><br /><Stars n={score} cls="text-lg" /><p className="text-xs font-bold text-white/70">{count} reviews</p></div>
            </a>
          )}
          {hasTA && (
            <a href={tripadvisor || TA_WRITE} target="_blank" rel="noopener noreferrer" className="flex min-w-[220px] flex-1 items-center gap-4 rounded-3xl bg-white/10 px-6 py-4 ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15">
              <p className="text-5xl font-black leading-none">{taScore.toFixed(1)}</p>
              <div className="leading-tight"><span className="text-xl font-extrabold text-emerald-300">TripAdvisor</span><br /><Stars n={taScore} cls="text-lg" /><p className="text-xs font-bold text-white/70">{taCount} reviews</p></div>
            </a>
          )}
        </div>
        {items.length > 0 && (
          <div className="relative mt-10">
            <div className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:scroll-pl-0 md:px-0" style={{ scrollbarWidth: "none" }} role="list" aria-label="Guest reviews">
              {items.slice(0, 12).map((r, i) => { const [ic, bg] = SRC[r.source] || SRC.Other; return (
                <figure key={i} role="listitem" className="relative flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] bg-white p-7 text-ink shadow-2xl sm:w-[360px]">
                  <span aria-hidden="true" className="absolute -right-1 -top-6 select-none font-serif text-[9rem] leading-none text-brand/10">”</span>
                  <Stars n={r.stars} cls="relative text-xl [&>span]:text-slate-300" />
                  <blockquote className="relative mt-3 line-clamp-6 text-[15px] leading-7 text-ink/85">{r.text}</blockquote>
                  <figcaption className="relative mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan-500 text-lg font-extrabold text-white">{r.name.trim()[0]?.toUpperCase()}</span>
                    <div className="min-w-0 leading-tight"><p className="truncate font-extrabold">{r.name}</p><p className="truncate text-xs text-ink/55">{[r.country, r.date].filter(Boolean).join(" · ")}</p></div>
                    <span title={r.source} className={`ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white ${bg}`}>{ic}</span>
                  </figcaption>
                </figure>); })}
            </div>
            {items.length > 1 && <p className="mt-1 text-center text-xs font-bold tracking-widest text-white/50">SWIPE FOR MORE →</p>}
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-extrabold">
          <a href={google} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-6 py-3 ring-1 ring-white/30 backdrop-blur hover:bg-white/20">Read all on Google ↗</a>
          <a href={GOOGLE_WRITE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold px-6 py-3 text-[#10222b] shadow-lg hover:brightness-105">Review us on Google ★</a>
          <a href={TA_WRITE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-500 px-6 py-3 text-white shadow-lg hover:bg-emerald-400">Review us on TripAdvisor ★</a>
        </div>
      </div>
    </section>
  );
}
