import { getReviews, GOOGLE_WRITE } from "@/lib/reviews";
const Stars = ({ n }) => <span className="text-amber-400" aria-label={`${n} out of 5`}>{"★".repeat(n)}<span className="text-slate-300">{"★".repeat(5 - n)}</span></span>;
export default async function Reviews() {
  const { items, tripadvisor, google, score, count } = await getReviews();
  return (
    <section className="bg-ice px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[11px] font-extrabold tracking-[.25em] text-brand/70">GUEST REVIEWS</p>
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-brand md:text-4xl">What our guests say</h2>
        {count > 0 && <p className="mt-4 text-center text-lg font-extrabold text-ink"><span className="text-amber-400">★★★★★</span> {score.toFixed(1)} on Google · {count} reviews</p>}
        {items.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 9).map((r, i) => (
              <figure key={i} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-sky-100">
                <Stars n={r.stars} />
                <blockquote className="mt-3 text-sm leading-6 text-ink/80">{r.text}</blockquote>
                <figcaption className="mt-4 text-xs font-bold text-ink/60">{r.name}{r.country ? `, ${r.country}` : ""} · {r.source}{r.date ? ` · ${r.date}` : ""}</figcaption>
              </figure>
            ))}
          </div>
        )}
        {(
          <p className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-extrabold">
            {tripadvisor && <a href={tripadvisor} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-2.5 text-brand shadow ring-1 ring-sky-200">See our reviews on TripAdvisor ↗</a>}
            {<a href={google} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-2.5 text-brand shadow ring-1 ring-sky-200">See our reviews on Google ↗</a>}
            <a href={GOOGLE_WRITE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-5 py-2.5 text-white shadow">Write a Google review ★</a>
          </p>
        )}
      </div>
    </section>
  );
}
