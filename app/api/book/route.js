import { headers, cookies } from "next/headers";
import { getTour } from "@/lib/tours";
import { placeBooking } from "@/lib/booking";
const hits = new Map();
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
  const h = await headers(); const host = h.get("x-forwarded-host") || h.get("host");
  const origin = `${h.get("x-forwarded-proto") || "https"}://${host}`;
  const r = await placeBooking(tour, b, { origin, affCode: (await cookies()).get("aff")?.value });
  return Response.json(r.body.url ? { ok: true, url: r.body.url } : r.body.ok ? { ok: true } : r.body, { status: r.status });
}
