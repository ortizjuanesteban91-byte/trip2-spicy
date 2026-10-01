import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAffSession, affLeads, listPayouts, owedOf, sum } from "@/lib/affiliates";
export const dynamic = "force-dynamic";
export const metadata = { title: "My affiliate account | Trip2", robots: { index: false, follow: false } };
const usd = (n) => `$${Number(n || 0).toFixed(2)}`;
const day = (d) => (d ? new Date(d).toLocaleDateString("en-US", { timeZone: "America/Santo_Domingo" }) : "");
export default async function Page() {
  const a = await getAffSession();
  if (!a) redirect("/affiliates#login");
  const [leads, payouts] = await Promise.all([affLeads(a.code), listPayouts(a.id)]);
  const h = await headers();
  const link = `${h.get("x-forwarded-proto") || "https"}://${h.get("x-forwarded-host") || h.get("host")}/?ref=${a.code}`;
  const pending = sum(leads.filter((l) => !l.completed_at));
  const owed = sum(owedOf(leads));
  const paid = sum(leads.filter((l) => l.paid_at));
  const status = (l) => (l.paid_at ? "Paid" : l.completed_at ? "Earned, payment this week" : "Waiting for the tour");
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-extrabold">Hi {a.name.split(" ")[0]}</h1><form method="post" action="/api/affiliate/logout"><button className="text-sm font-bold text-brand">Log out</button></form></div>
      <section className="mt-5 rounded-2xl bg-white p-5 shadow"><p className="text-sm font-bold text-[#667085]">Your personal link (add <b>?ref={a.code}</b> to any page)</p><p className="mt-2 break-all rounded-xl bg-[#f4f7fc] p-3 font-mono text-sm">{link}</p></section>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[["Waiting", pending], ["To be paid", owed], ["Paid", paid]].map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xl font-extrabold text-brand">{usd(v)}</p><p className="text-xs font-bold text-[#667085]">{l}</p></div>)}
      </div>
      <p className="mt-3 text-sm text-[#667085]">Commission becomes yours once the guest completes the tour. Paid weekly by {a.method}.</p>
      <h2 className="mt-8 text-xl font-extrabold">Bookings</h2>
      <div className="mt-3 grid gap-2">{leads.map((l) => <div key={l.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-white p-4 text-sm shadow-sm"><span><b>{l.name.split(" ")[0]}</b> · {l.listing} · {day(l.created_at)}</span><span><b>{usd(l.commission)}</b> · {status(l)}</span></div>)}{!leads.length && <p className="text-[#667085]">No bookings yet. Share your link!</p>}</div>
      <h2 className="mt-8 text-xl font-extrabold">Payments received</h2>
      <div className="mt-3 grid gap-2">{payouts.map((p) => <div key={p.id} className="flex justify-between rounded-xl bg-white p-4 text-sm shadow-sm"><span>{day(p.created_at)} · {p.bookings} bookings · {p.method}</span><b>{usd(p.amount)}</b></div>)}{!payouts.length && <p className="text-[#667085]">None yet.</p>}</div>
    </main>
  );
}
