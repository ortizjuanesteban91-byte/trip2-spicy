import { verifyStripe } from "@/lib/pay";
// Stripe calls this after a payment. Marks the lead as PAID in the database.
export async function POST(req) {
  const raw = await req.text();
  if (!verifyStripe(raw, req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET)) return new Response("bad signature", { status: 400 });
  let ev; try { ev = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }
  if (ev.type === "checkout.session.completed" && ev.data?.object?.payment_status === "paid") {
    const o = ev.data.object, id = o.metadata?.lead_id;
    const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
    if (url && key && /^\d+$/.test(String(id))) {
      const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
      const cur = await fetch(`${url}/rest/v1/leads?id=eq.${id}&select=details`, { headers: h, cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []);
      const details = { ...(cur[0]?.details || {}), Payment: `PAID $${(o.amount_total || 0) / 100} (${o.payment_intent || o.id})` };
      await fetch(`${url}/rest/v1/leads?id=eq.${id}`, { method: "PATCH", headers: { ...h, Prefer: "return=minimal" }, body: JSON.stringify({ details }) });
    }
  }
  return new Response("ok");
}
