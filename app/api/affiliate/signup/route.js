import { headers } from "next/headers";
import { createAffiliate, affiliateByEmail, METHODS } from "@/lib/affiliates";
import { sendLeadAlert } from "@/lib/notify";
const hits = new Map();
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
export async function POST(req) {
  const f = await req.formData();
  if (f.get("website")) return go("/affiliates?ok=1");
  const ip = ((await headers()).get("x-forwarded-for") || "x").split(",")[0], now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  if (recent.length >= 5) return go("/affiliates?e=slow");
  hits.set(ip, [...recent, now]);
  const s = (k, n = 200) => String(f.get(k) ?? "").trim().slice(0, n);
  const name = s("name", 120), email = s("email", 160).toLowerCase(), phone = s("phone", 40), country = s("country", 60), method = s("method", 30), payout = s("payout", 600), password = String(f.get("password") || "");
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !phone || !METHODS.includes(method) || !payout || password.length < 8) return go("/affiliates?e=form#signup");
  if (await affiliateByEmail(email)) return go("/affiliates?e=exists#signup");
  const code = await createAffiliate({ name, email, phone, country, method, payout, password });
  if (!code) return go("/affiliates?e=db#signup");
  await sendLeadAlert({ kind: "affiliate", name, email, phone, message: "New affiliate waiting for approval in the back end.", details: { Country: country, "Payout method": method, Code: code } });
  return go("/affiliates?ok=1");
}
