import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { getTour } from "@/lib/tours";
import AdminPhotos from "@/components/AdminPhotos";
export const dynamic = "force-dynamic";
export const metadata = { title: "Edit tour | Admin", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const F = ({ label, hint, children }) => <label className="grid gap-1 text-sm font-bold">{label}{hint && <span className="text-xs font-normal text-[#667085]">{hint}</span>}{children}</label>;
export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const { e } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "tours")) redirect(firstArea(session));
  const t = await getTour(slug, { includeHidden: true, fresh: true });
  if (!t) redirect("/admin/tours");
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/admin/tours" className="text-sm font-bold text-brand">← All tours</Link>
      <h1 className="mt-2 text-2xl font-bold">{t.name}</h1>
      <p className="mt-1 text-sm"><a href={`/tour/${t.slug}`} target="_blank" className="font-bold text-brand">View on the website ↗</a></p>
      {e && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not save. Is Supabase connected?</p>}
      <form method="post" action="/api/admin/tour" className="mt-6 grid gap-5">
        <input type="hidden" name="slug" value={t.slug} />
        <section className="grid gap-4 rounded-2xl bg-white p-5 shadow">
          <h2 className="text-lg font-bold">Visibility &amp; price</h2>
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="hidden" defaultChecked={t.hidden} className="h-5 w-5" /> Hide this tour from the website</label>
          <F label={'"From" price shown on cards (USD)'}><input name="from" type="number" step="0.01" inputMode="decimal" defaultValue={t.from} className={inp} /></F>
        </section>
        <section className="grid gap-4 rounded-2xl bg-white p-5 shadow">
          <h2 className="text-lg font-bold">Booking prices (USD)</h2>
          <p className="text-sm text-[#667085]">This is what guests are charged. Weekend price is optional (Friday and Saturday).</p>
          {t.options.map((o, i) => (
            <div key={i} className="grid grid-cols-[1fr_110px_110px] items-end gap-3">
              <p className="pb-3 text-sm font-bold">{o.label}</p>
              <F label="Price"><input name={`price_${i}`} type="number" step="0.01" inputMode="decimal" defaultValue={o.price} className={inp} /></F>
              <F label="Weekend"><input name={`wknd_${i}`} type="number" step="0.01" inputMode="decimal" defaultValue={o.priceWknd || ""} className={inp} /></F>
            </div>
          ))}
        </section>
        <section className="grid gap-3 rounded-2xl bg-white p-5 shadow">
          <h2 className="text-lg font-bold">Photos</h2>
          <p className="text-sm text-[#667085]">Upload from your phone. The first photo is the main one. Leave empty to keep the current pictures.</p>
          <AdminPhotos name="photos" initial={t.photos || []} />
        </section>
        <button className="rounded-xl bg-brand p-4 font-extrabold text-white">Save tour</button>
      </form>
    </main>
  );
}
