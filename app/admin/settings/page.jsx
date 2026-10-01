import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { getSite } from "@/lib/siteconf";
import { getPayments, stripeEnv } from "@/lib/pay";
export const dynamic = "force-dynamic";
export const metadata = { title: "Settings | Admin", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const F = ({ label, hint, children }) => <label className="grid gap-1 text-sm font-bold">{label}{hint && <span className="text-xs font-normal text-[#667085]">{hint}</span>}{children}</label>;
export default async function Page({ searchParams }) {
  const { saved } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "settings")) redirect(firstArea(session));
  const site = await getSite(true);
  const pay = await getPayments(true);
  const env = stripeEnv();
  const smtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS) || !!process.env.RESEND_API_KEY;
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-bold">Settings &amp; payments</h1>
      {saved && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Saved. The website updates within a minute.</p>}

      <section className="mt-6">
        <h2 className="text-xl font-extrabold">Booking alerts by email</h2>
        <p className="mt-1 text-sm text-[#667085]">Every new booking or message is emailed to this address.</p>
        <div className="mt-3 grid gap-1 rounded-xl bg-white p-4 text-sm shadow-sm">
          <p>{smtp ? "✅" : "⬜"} Email sending set up in Vercel (<code>SMTP_USER</code> + <code>SMTP_PASS</code>)</p>
        </div>
        <form method="post" action="/api/admin/settings" className="mt-3 grid gap-4 rounded-2xl bg-white p-5 shadow">
          <F label="Send alerts to"><input name="email" type="email" defaultValue={site.email} className={inp} /></F>
          <button className="rounded-xl bg-brand p-3 font-extrabold text-white">Save</button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-extrabold">Pay online (cards)</h2>
        <p className="mt-1 text-sm text-[#667085]">When this is on, guests pay by card on Stripe's secure page right after booking. When it is off, bookings are "pay later" like today. It only goes live when this is switched on <b>and</b> the Stripe keys are in Vercel.</p>
        <div className="mt-3 grid gap-1 rounded-xl bg-white p-4 text-sm shadow-sm">
          <p>{env.key ? "✅" : "⬜"} Stripe secret key in Vercel (<code>STRIPE_SECRET_KEY</code>)</p>
          <p>{env.webhook ? "✅" : "⬜"} Stripe webhook secret in Vercel (<code>STRIPE_WEBHOOK_SECRET</code>) so paid bookings show PAID</p>
          <p className="font-bold">{pay.active ? "🟢 Card payment is LIVE on tour bookings" : "⚪ Card payment is not live (bookings are pay later)"}</p>
        </div>
        <form method="post" action="/api/admin/payments" className="mt-3 grid gap-4 rounded-2xl bg-white p-5 shadow">
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="online_enabled" defaultChecked={pay.enabled} className="h-5 w-5" /> Switch on card payment</label>
          <F label="How much to charge online" hint="100 = the full price. 30 = a 30% deposit, the rest is paid on the day."><select name="deposit_pct" defaultValue={String(pay.pct)} className={inp}>{[100, 50, 30, 20].map((p) => <option key={p} value={p}>{p === 100 ? "100% (full price)" : `${p}% deposit`}</option>)}</select></F>
          <button className="rounded-xl bg-brand p-3 font-extrabold text-white">Save payments</button>
        </form>
      </section>
    </main>
  );
}
