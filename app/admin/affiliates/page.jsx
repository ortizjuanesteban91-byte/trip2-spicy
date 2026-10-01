import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { listAffiliates, allAffLeads, listPayouts, owedOf, sum } from "@/lib/affiliates";
export const dynamic = "force-dynamic";
export const metadata = { title: "Affiliates | Admin", robots: { index: false, follow: false } };
const usd = (n) => `$${Number(n || 0).toFixed(2)}`;
const day = (d) => new Date(d).toLocaleDateString("en-US", { timeZone: "America/Santo_Domingo" });
const Btn = ({ id, act, children, cls = "bg-[#eef2f6]" }) => <form method="post" action="/api/admin/affiliates"><input type="hidden" name="id" value={id} /><button name="act" value={act} className={`rounded-full px-4 py-2 text-sm font-bold ${cls}`}>{children}</button></form>;
export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "affiliates")) redirect(firstArea(session));
  const [affs, leads, payouts] = await Promise.all([listAffiliates(), allAffLeads(), listPayouts()]);
  const mine = (a) => leads.filter((l) => l.aff === a.code);
  const totalOwed = sum(owedOf(leads));
  const name = new Map(affs.map((a) => [a.id, a.name]));
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-2xl font-extrabold">Affiliates</h1>
      <p className="mt-1 text-sm text-[#667085]">Registration page: <a className="font-bold text-brand" href="/affiliates" target="_blank">/affiliates</a>. Commission is set per tour (Tours → edit tour). Mark a booking "Tour completed" in Bookings &amp; leads, then pay weekly here.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-center"><div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-extrabold text-brand">{usd(totalOwed)}</p><p className="text-xs font-bold text-[#667085]">Owed to affiliates now</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-extrabold text-brand">{affs.filter((a) => a.status === "pending").length}</p><p className="text-xs font-bold text-[#667085]">Waiting for approval</p></div></div>
      <div className="mt-6 grid gap-4">
        {affs.map((a) => { const ls = mine(a), owed = sum(owedOf(ls)); return (
          <article key={a.id} className={`rounded-2xl bg-white p-5 shadow ${a.status === "disabled" ? "opacity-60" : ""}`}>
            <p className="font-extrabold">{a.name} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${a.status === "approved" ? "bg-emerald-100 text-emerald-800" : a.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-[#eef2f6]"}`}>{a.status}</span></p>
            <p className="mt-1 text-sm">{a.email} · {a.phone}{a.country ? ` · ${a.country}` : ""} · code <b>{a.code}</b></p>
            <p className="mt-2 rounded-xl bg-[#f4f7fc] p-3 text-sm"><b>{a.method}:</b> {a.payout}</p>
            <p className="mt-2 text-sm">Bookings {ls.length} · Earned unpaid <b>{usd(owed)}</b> · Waiting for tour {usd(sum(ls.filter((l) => !l.completed_at)))} · Paid {usd(sum(ls.filter((l) => l.paid_at)))}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.status !== "approved" && <Btn id={a.id} act="approve" cls="bg-brand text-white">Approve</Btn>}
              {a.status === "approved" && owed > 0 && <Btn id={a.id} act="pay" cls="bg-emerald-600 text-white">Mark paid {usd(owed)}</Btn>}
              {a.status === "approved" && <Btn id={a.id} act="disable">Disable</Btn>}
            </div>
          </article>); })}
        {!affs.length && <p className="text-[#667085]">No affiliates yet.</p>}
      </div>
      <h2 className="mt-10 text-xl font-extrabold">Payments made</h2>
      <div className="mt-3 grid gap-2">{payouts.map((p) => <div key={p.id} className="flex justify-between rounded-xl bg-white p-4 text-sm shadow-sm"><span>{day(p.created_at)} · {name.get(p.affiliate_id) || "?"} · {p.bookings} bookings · {p.method}</span><b>{usd(p.amount)}</b></div>)}{!payouts.length && <p className="text-[#667085]">None yet.</p>}</div>
    </main>
  );
}
