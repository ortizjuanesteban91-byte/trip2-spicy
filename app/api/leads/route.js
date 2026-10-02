import { saveLead } from "@/lib/leads";
import { sendLeadAlert } from "@/lib/notify";
export async function POST(req) {
  let b; try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (b.website) return Response.json({ ok: true }); // honeypot for bots
  const s = (v, n = 500) => String(v || "").slice(0, n).trim();
  const lead = { kind: s(b.kind, 20), name: s(b.name, 120), email: s(b.email, 160), phone: s(b.phone, 40), budget: s(b.budget, 80), message: s(b.message, 2000), listing: s(b.listing, 120), details: Object.fromEntries(Object.entries(b.details || {}).slice(0, 25).map(([k, v]) => [s(k, 60), s(v, 500)])) };
  if (!lead.name || (!lead.email && !lead.phone)) return Response.json({ ok: false, error: "Name and email or phone required" }, { status: 400 });
  if (!["contact", "enquiry", "transfer"].includes(lead.kind)) lead.kind = "contact";
  const r = await saveLead(lead);
  if (r.ok) await sendLeadAlert(lead);
  return Response.json(r, { status: r.ok ? 200 : 503 });
}
