// One booking engine used by the tour-page form (/api/book) AND the chat bot (/api/chat).
// The server recomputes the price (never trusts the browser or the bot), saves the lead, sends the alert,
// and returns a Stripe Checkout URL only when card payment is live. Otherwise it is "pay later".
import { tourPrivate } from "./tours";
import { affiliateByCode } from "./affiliates";
import { quote } from "./pricing";
import { getPayments, createBookingCheckout } from "./pay";
import { sendLeadAlert } from "./notify";
export const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const s = (v, n = 200) => String(v ?? "").trim().slice(0, n);
// returns { status, body } ; body.ok true on success (body.url = pay link, body.payLater = true when no card payment)
export async function placeBooking(tour, b, { origin, affCode = "", source = "website" } = {}) {
  const q = quote(tour, { date: s(b.date, 10), qty: b.qty || {} });
  if (!q.ok) return { status: 400, body: { ok: false, error: q.error } };
  const name = s(b.name, 120), email = s(b.email, 160), phone = s(b.phone, 40);
  if (!name || (!email && !phone)) return { status: 400, body: { ok: false, error: "contact" } };
  if (b.terms !== true) return { status: 400, body: { ok: false, error: "terms" } }; // guest must accept the Terms & Activity Waiver
  const pay = await getPayments(true);
  const hotel = s(b.hotel, 160);
  const lead = {
    kind: "booking", name, email, phone, message: s(b.notes, 1000), listing: tour.slug,
    details: { Tour: tour.name, Date: s(b.date, 10), Time: s(b.time, 40), Hotel: hotel, Guests: String(q.people), Order: q.lines.map((l) => `${l.label} · ${l.qty} × ${money(l.price)} = ${money(l.qty * l.price)}`).join(" | "), Total: money(q.total), "Terms & Waiver": `Accepted ${new Date().toISOString()} (${source})`, Payment: pay.active ? (pay.pct >= 100 ? "awaiting card payment" : `awaiting ${pay.pct}% deposit`) : "pay later", ...(source !== "website" ? { Source: source } : {}) },
  };
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { status: 503, body: { ok: false, error: "not-configured" } };
  // Private extras: supplier cost, and the affiliate (cookie from their ?ref= link) with the commission earned if the tour is completed.
  const pv = await tourPrivate(tour.slug);
  const cost = Math.round((tour.options || []).reduce((a, o, i) => a + Math.max(0, Math.min(20, Math.floor(Number(b.qty?.[i]) || 0))) * (pv.costs[i] || 0), 0) * 100) / 100;
  const aff = await affiliateByCode(affCode);
  const extra = {};
  if (cost > 0) extra.cost = cost;
  if (aff && aff.status === "approved") {
    const basis = cost > 0 ? Math.max(0, q.total - cost) : q.total;
    extra.aff = aff.code; extra.commission = Math.round(basis * pv.rate) / 100;
    lead.details.Affiliate = `${aff.name} (${aff.code})`;
  }
  const post = (row) => fetch(`${url}/rest/v1/leads`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(row) });
  let ins = await post({ ...lead, ...extra });
  if (!ins.ok && Object.keys(extra).length) ins = await post(lead); // booking is never lost if the new columns are not in the database yet
  if (!ins.ok) return { status: 503, body: { ok: false, error: "db" } };
  const id = (await ins.json().catch(() => []))?.[0]?.id;
  await sendLeadAlert(lead);
  const done = { total: q.total, people: q.people };
  if (!pay.active || !id) return { status: 200, body: { ok: true, payLater: true, ...done } };
  const out = await createBookingCheckout({ lines: q.lines.filter((l) => l.price > 0), total: q.total, pct: pay.pct, title: tour.name, leadId: id, origin, email });
  return { status: 200, body: out.ok ? { ok: true, url: out.url, pct: pay.pct, ...done } : { ok: true, payLater: true, ...done } }; // booking is saved either way
}
