import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { allTours } from "@/lib/tours";
export const dynamic = "force-dynamic";
export const metadata = { title: "Tours | Admin", robots: { index: false, follow: false } };
export default async function Page({ searchParams }) {
  const { saved } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "tours")) redirect(firstArea(session));
  const list = await allTours({ includeHidden: true, fresh: true });
  const connected = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-2xl font-bold">Tours ({list.length})</h1>
      <p className="mt-1 text-sm text-[#667085]">Change prices, show or hide a tour, and add photos. Texts and SEO stay as they are.</p>
      {saved && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Saved. The website updates within a minute.</p>}
      {!connected && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Supabase is not connected yet, so changes cannot be saved. Add SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel.</p>}
      <div className="mt-6 grid gap-3">
        {list.map((t) => (
          <Link key={t.slug} href={`/admin/tours/${t.slug}`} className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow ${t.hidden ? "opacity-60" : ""}`}>
            <span className="flex-1"><b className="block">{t.name}</b><span className="text-sm text-[#667085]">from ${t.from}{t.edited ? " · edited" : ""}{t.by ? ` by ${t.by}` : ""}</span></span>
            {t.hidden && <span className="rounded-full bg-[#eef2f6] px-2 py-1 text-xs font-bold">Hidden</span>}
            <span className="text-sm font-bold text-brand">Edit</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
