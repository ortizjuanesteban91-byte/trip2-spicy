import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { getReviews } from "@/lib/reviews";
export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews | Admin", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
export default async function Page({ searchParams }) {
  const { saved, e } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "reviews")) redirect(firstArea(session));
  const { items, tripadvisor, google, score, count } = await getReviews(true);
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-extrabold">Reviews</h1>
      <p className="mt-1 text-sm text-[#667085]">Real reviews from your guests (Google, TripAdvisor, direct). The home page shows the latest 9. Nothing shows until you add it.</p>
      {saved && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Saved. The website updates within a minute.</p>}
      {e && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not save. Is Supabase connected?</p>}
      <form method="post" action="/api/admin/reviews" className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow">
        <input type="hidden" name="act" value="add" />
        <h2 className="text-lg font-bold">Add reviews</h2>
        <p className="text-sm text-[#667085]">One review per line, parts separated by <b>|</b>:<br /><code className="text-xs">Name | Country | Stars | Source | Date | Review text</code><br /><span className="text-xs">Example: Maria L | USA | 5 | Google | Sep 2026 | Best day of our trip!  (Source: Google, TripAdvisor, Direct or Other)</span></p>
        <textarea name="lines" rows={6} required className={inp} placeholder="Maria L | USA | 5 | Google | Sep 2026 | Best day of our trip!" />
        <button className="rounded-xl bg-brand p-3 font-extrabold text-white">Add</button>
      </form>
      <form method="post" action="/api/admin/reviews" className="mt-5 grid gap-3 rounded-2xl bg-white p-5 shadow">
        <input type="hidden" name="act" value="links" />
        <h2 className="text-lg font-bold">Your review pages</h2>
        <input name="tripadvisor" defaultValue={tripadvisor} placeholder="TripAdvisor page link (https://...)" className={inp} />
        <input name="google" defaultValue={google} placeholder="Google reviews link (https://...)" className={inp} />
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-bold">Google rating<input name="score" type="number" step="0.1" min="1" max="5" defaultValue={score} className={inp} /></label><label className="grid gap-1 text-sm font-bold">Number of Google reviews<input name="count" type="number" min="0" defaultValue={count} className={inp} /></label></div>
        <p className="text-xs text-[#667085]">Copy these two numbers from your Google Business Profile now and then. Set reviews to 0 to hide the line.</p>
        <button className="rounded-xl bg-[#0d1626] p-3 font-extrabold text-white">Save</button>
      </form>
      <h2 className="mt-8 text-lg font-bold">Current reviews ({items.length})</h2>
      <div className="mt-3 grid gap-3">
        {items.map((r, i) => (
          <article key={i} className="rounded-2xl bg-white p-4 text-sm shadow-sm">
            <p className="font-bold">{"★".repeat(r.stars)} {r.name}{r.country ? `, ${r.country}` : ""} · {r.source}{r.date ? ` · ${r.date}` : ""}</p>
            <p className="mt-1">{r.text}</p>
            <form method="post" action="/api/admin/reviews" className="mt-2"><input type="hidden" name="act" value="delete" /><input type="hidden" name="i" value={i} /><button className="rounded-full bg-[#eef2f6] px-3 py-1 text-xs font-bold text-red-700">Delete</button></form>
          </article>
        ))}
        {!items.length && <p className="text-[#667085]">No reviews yet.</p>}
      </div>
    </main>
  );
}
