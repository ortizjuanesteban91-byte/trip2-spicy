import { redirect } from "next/navigation";
import { getSession, can, firstArea, fetchLeads } from "@/lib/admin";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Trip2 Spicy", robots: { index: false, follow: false } };
const KIND = { booking: "Booking", contact: "Contact" };
const wa = (p) => `https://wa.me/${String(p || "").replace(/\D/g, "")}`;
export default async function Admin({ searchParams }) {
  const { e } = await searchParams;
  const session = await getSession();
  if (!session) {
    return (
      <main className="mx-auto max-w-sm px-5 py-16">
        <p className="text-center text-sm font-extrabold tracking-widest text-brand">TRIP2 SPICY</p>
        <h1 className="mt-1 text-center text-3xl font-extrabold">Admin login</h1>
        <div className="mt-6 rounded-2xl bg-white p-5 shadow">
        {!process.env.ADMIN_PASSWORD && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">ADMIN_PASSWORD is not set in Vercel yet.</p>}
        <form method="post" action="/api/admin/login" className="grid gap-3">
          <input name="email" type="text" inputMode="email" autoCapitalize="none" placeholder="Email (leave empty if you are the owner)" className="rounded-xl border border-[#d9dee5] p-3" />
          <input type="password" name="password" placeholder="Password" required className="rounded-xl border border-[#d9dee5] p-3" />
          <button className="rounded-xl bg-brand p-3 font-extrabold text-white">Log in</button>
          {e && <p className="text-sm text-red-600">Wrong email or password.</p>}
        </form>
        </div>
        <p className="mt-4 text-center text-xs text-[#667085]">Owner: leave the email empty and use your admin password.</p>
      </main>
    );
  }
  if (!can(session, "leads")) redirect(firstArea(session));
  const { ok, reason, rows } = await fetchLeads();
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-2xl font-extrabold">Bookings &amp; leads</h1>
      <p className="mt-1 text-sm text-[#667085]">Tour bookings and messages from the website. Tap a phone number to open WhatsApp.</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        {[["new", "New"], ["contacted", "Contacted"], ["closed", "Closed"]].map(([k, label]) => (
          <div key={k} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-extrabold text-brand">{rows.filter((r) => (r.status || "new") === k).length}</p><p className="text-xs font-bold text-[#667085]">{label}</p></div>
        ))}
      </div>
      {!ok && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{reason === "not-configured" ? "Supabase is not connected yet (SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel)." : `Could not load leads (${reason}).`}</p>}
      <div className="mt-6 grid gap-4">
        {rows.map((l) => (
          <article key={l.id} className={`rounded-2xl bg-white p-5 shadow ${l.status === "closed" ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold">{l.name} <span className="ml-2 rounded-full bg-[#eef2f6] px-2 py-0.5 text-xs font-bold">{KIND[l.kind] || l.kind}</span>{String(l.details?.Payment || "").startsWith("PAID") && <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">PAID</span>}{l.lang && l.lang !== "en" && <span className="ml-1 rounded-full bg-[#eef2f6] px-2 py-0.5 text-xs font-bold">{l.lang.toUpperCase()}</span>}</p>
              <p className="text-xs text-[#667085]">{new Date(l.created_at).toLocaleString("en-US", { timeZone: "America/Santo_Domingo" })}</p>
            </div>
            <p className="mt-2 text-sm">{l.phone && <a className="font-bold text-brand" href={wa(l.phone)}>{l.phone}</a>}{l.phone && l.email && " · "}{l.email && <a className="text-brand" href={`mailto:${l.email}`}>{l.email}</a>}{l.listing ? ` · ${l.listing}` : ""}{l.budget ? ` · ${l.budget}` : ""}</p>
            {l.message && <p className="mt-2 text-sm">{l.message}</p>}
            {l.details && Object.keys(l.details).length > 0 && (
              <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{Object.entries(l.details).map(([k, v]) => /^https?:\/\//.test(String(v)) || k === "Photos" ? <div key={k} className="sm:col-span-2"><dt className="font-bold">{k}</dt><dd className="flex flex-wrap gap-2">{String(v).split(/\s+/).filter(Boolean).map((u) => <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="h-20 w-20 rounded-lg object-cover" /></a>)}</dd></div> : <div key={k}><dt className="inline font-bold">{k}: </dt><dd className="inline">{v}</dd></div>)}</dl>
            )}
            <form method="post" action="/api/admin/status" className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={l.id} />
              {["new", "contacted", "closed"].map((s) => <button key={s} name="status" value={s} className={`rounded-full px-3 py-1 text-xs font-bold ${(l.status || "new") === s ? "bg-brand text-white" : "bg-[#eef2f6]"}`}>{s}</button>)}
            </form>
          </article>
        ))}
        {ok && rows.length === 0 && <p className="text-[#667085]">No leads yet.</p>}
      </div>
    </main>
  );
}
