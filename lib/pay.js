// Card payment for tour bookings with Stripe Checkout (hosted page: card data never touches this site).
// Live only when: switched on in /admin > Settings AND STRIPE_SECRET_KEY is set in Vercel. Otherwise bookings are "pay later" (as before).
import { createHmac, timingSafeEqual } from "crypto";
import { getSetting } from "./siteconf";

export const stripeEnv = () => ({ key: !!process.env.STRIPE_SECRET_KEY, webhook: !!process.env.STRIPE_WEBHOOK_SECRET });
export async function getPayments(fresh = false) {
  const d = (await getSetting("payments", fresh)) || {};
  const enabled = !!d.online_enabled;
  const pct = Math.min(100, Math.max(10, Math.round(Number(d.deposit_pct) || 100)));
  return { enabled, pct, active: enabled && !!process.env.STRIPE_SECRET_KEY };
}
export async function createBookingCheckout({ lines, total, pct, title, leadId, origin, email }) {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("success_url", `${origin}/booking-thanks`);
  p.set("cancel_url", `${origin}/booking-cancelled`);
  if (pct >= 100) {
    lines.forEach((l, i) => {
      p.set(`line_items[${i}][quantity]`, String(l.qty));
      p.set(`line_items[${i}][price_data][currency]`, "usd");
      p.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.price * 100)));
      p.set(`line_items[${i}][price_data][product_data][name]`, `${title} – ${l.label}`);
    });
  } else {
    p.set("line_items[0][quantity]", "1");
    p.set("line_items[0][price_data][currency]", "usd");
    p.set("line_items[0][price_data][unit_amount]", String(Math.round(total * pct)));
    p.set("line_items[0][price_data][product_data][name]", `${title} – ${pct}% deposit`);
  }
  p.set("metadata[lead_id]", String(leadId));
  p.set("payment_intent_data[metadata][lead_id]", String(leadId));
  if (email) p.set("customer_email", email);
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body: p });
  const j = await r.json().catch(() => ({}));
  return r.ok && j.url ? { ok: true, url: j.url } : { ok: false };
}
// Stripe-Signature: t=timestamp,v1=hex  (HMAC SHA256 of `${t}.${rawBody}`)
export function verifyStripe(raw, header, secret) {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(String(header).split(",").map((x) => x.split("=")));
  if (!parts.t || !parts.v1 || Math.abs(Date.now() / 1000 - Number(parts.t)) > 600) return false;
  const exp = createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest("hex");
  const a = Buffer.from(exp), b = Buffer.from(parts.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}
