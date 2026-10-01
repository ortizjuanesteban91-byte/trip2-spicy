import { headers } from "next/headers";
import { getTour } from "@/lib/tours";
import { quote } from "@/lib/pricing";
import { getPayments, createBookingCheckout } from "@/lib/pay";
import { sendLeadAlert } from "@/lib/notify";
const hits = new Map();
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
// Booking from the tour page. The server recomputes the price (never trusts the browser), saves the lead,
// and if online payment is live sends the guest to Stripe Checkout. Otherwise it is "pay later" like before.
export async function POST(req) {
  let b; try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (b.website) return Response.json({ ok: true });
  const ip = ((await headers()).get("x-forwarded-for") || "x").split(",")[0], now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (recent.length >= 10) return Response.json({ ok: false, error: "slow-down" }, { status: 429 });
  hits.set(ip, [...recent, now]);
  const s = (v, n = 200) => String(v ?? "").trim().slice(0, n);
  const tour = await getTour(s(b.tour, 120));
  if (!tour) return Response.json({ ok: false, error: "tour" }, { status: 404 });
  const q = quote(tour, { date: s(b.date, 10), qty: b.qty || {} });
  if (!q.ok) return Response.json({ ok: false, error: q.error }, { status: 400 });
  const name = s(b.name, 120), email = s(b.email, 160), phone = s(b.phone, 40);
  if (!name || (!email && !phone)) return Response.json({ ok: false, error: "contact" }, { status: 400 });
  const pay = await getPayments(true);
  const hotel = s(b.hotel, 160);
  const lead = {
    kind: "booking", name, email, phone, message: s(b.notes, 1000), listing: tour.slug,
    details: { Tour: tour.name, Date: s(b.date, 10), Time: s(b.time, 40), Hotel: hotel, Guests: String(q.people), Order: q.lines.map((l) => `${l.label} · ${l.qty} × ${money(l.price)} = ${money(l.qty * l.price)}`).join(" | "), Total: money(q.total), Payment: pay.active ? (pay.pct >= 100 ? "awaiting card payment" : `awaiting ${pay.pct}% deposit`) : "pay later" },
  };
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  const ins = await fetch(`${url}/rest/v1/leads`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(lead) });
  if (!ins.ok) return Response.json({ ok: false, error: "db" }, { status: 503 });
  const id = (await ins.json().catch(() => []))?.[0]?.id;
  await sendLeadAlert(lead);
  if (!pay.active || !id) return Response.json({ ok: true });
  const h = await headers(); const host = h.get("x-forwarded-host") || h.get("host");
  const origin = `${h.get("x-forwarded-proto") || "https"}://${host}`;
  const out = await createBookingCheckout({ lines: q.lines.filter((l) => l.price > 0), total: q.total, pct: pay.pct, title: tour.name, leadId: id, origin, email });
  return out.ok ? Response.json({ ok: true, url: out.url }) : Response.json({ ok: true, payLater: true }); // booking is saved either way
}
