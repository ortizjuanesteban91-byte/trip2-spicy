// Affiliates: people who send guests to Trip2 with a personal link (?ref=CODE) and earn a commission per completed tour.
// Tables: affiliates, payouts (see supabase/schema.sql). Booking fields on `leads`: aff, cost, commission, completed_at, paid_at, payout_id.
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { hashPassword, checkPassword } from "@/lib/admin";
export { checkPassword };
export const METHODS = ["Bank transfer", "PayPal", "Zelle", "Other"];
export const COOKIE_DAYS = 30;
const base = () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY });
async function db(path, init = {}) {
  const { url, key } = base();
  if (!url || !key) return { ok: false, status: 0, json: async () => [] };
  try { return await fetch(`${url}/rest/v1/${path}`, { cache: "no-store", ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) } }); } catch { return { ok: false, status: 0, json: async () => [] }; }
}
const rows = async (r) => (r.ok ? await r.json().catch(() => []) : []);
const enc = encodeURIComponent;

// ---- login cookie (separate from the admin cookie)
const secret = () => `${process.env.ADMIN_PASSWORD || ""}|${process.env.SUPABASE_SERVICE_KEY || ""}|trip2-aff-v1`;
const sign = (p) => createHmac("sha256", secret()).update(p).digest("base64url");
const eq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
export const makeAffCookie = (id) => { const p = Buffer.from(JSON.stringify({ i: id, x: Date.now() + 14 * 864e5 })).toString("base64url"); return `${p}.${sign(p)}`; };
export async function getAffSession() {
  const v = (await cookies()).get("aff_s")?.value;
  if (!v || !v.includes(".")) return null;
  const [p, sig] = v.split(".");
  if (!eq(sig, sign(p))) return null;
  let d; try { d = JSON.parse(Buffer.from(p, "base64url").toString()); } catch { return null; }
  if (!d.x || d.x < Date.now()) return null;
  const a = await affiliateById(d.i);
  return a && a.status === "approved" ? a : null;
}

// ---- affiliates
export const validCode = (c) => /^[a-z0-9]{4,24}$/i.test(String(c || ""));
export async function affiliateById(id) { if (!/^\d+$/.test(String(id))) return null; return (await rows(await db(`affiliates?id=eq.${id}&select=*`)))[0] || null; }
export async function affiliateByEmail(email) { return (await rows(await db(`affiliates?email=eq.${enc(String(email).toLowerCase())}&select=*`)))[0] || null; }
export async function affiliateByCode(code) { if (!validCode(code)) return null; return (await rows(await db(`affiliates?code=eq.${enc(String(code).toLowerCase())}&select=*`)))[0] || null; }
export async function listAffiliates() { return rows(await db("affiliates?select=*&order=created_at.desc&limit=500")); }
export async function patchAffiliate(id, patch) { if (!/^\d+$/.test(String(id))) return false; return (await db(`affiliates?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) })).ok; }
export async function createAffiliate({ name, email, phone, country, method, payout, password }) {
  const slug = String(name).toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").slice(0, 8) || "aff";
  for (let n = 0; n < 5; n++) {
    const code = `${slug}${Math.random().toString(36).slice(2, 5)}`;
    if (await affiliateByCode(code)) continue;
    const r = await db("affiliates", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name, email: String(email).toLowerCase(), phone, country, method, payout, code, pass: hashPassword(password), status: "pending" }) });
    return r.ok ? code : null;
  }
  return null;
}

// ---- bookings brought by affiliates
export const affLeads = async (code) => rows(await db(`leads?aff=eq.${enc(code)}&select=id,created_at,name,listing,commission,completed_at,paid_at,details&order=created_at.desc&limit=300`));
export const allAffLeads = async () => rows(await db("leads?aff=not.is.null&select=id,created_at,aff,commission,completed_at,paid_at&limit=2000"));
export const listPayouts = async (affiliateId) => rows(await db(`payouts?${affiliateId ? `affiliate_id=eq.${affiliateId}&` : ""}select=*&order=created_at.desc&limit=100`));
export async function setCompleted(leadId, done) {
  if (!/^\d+$/.test(String(leadId))) return false;
  return (await db(`leads?id=eq.${leadId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ completed_at: done ? new Date().toISOString() : null }) })).ok;
}
export const owedOf = (leads) => leads.filter((l) => l.completed_at && !l.paid_at && Number(l.commission) > 0);
export const sum = (ls) => Math.round(ls.reduce((a, l) => a + Number(l.commission || 0), 0) * 100) / 100;
// Pay everything earned and unpaid for one affiliate: one payout record + every booking marked paid.
export async function payAffiliate(a, note = "") {
  const due = owedOf(await affLeads(a.code));
  if (!due.length) return { ok: false, error: "nothing" };
  const amount = sum(due);
  const p = await db("payouts", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ affiliate_id: a.id, amount, bookings: due.length, method: a.method, note }) });
  if (!p.ok) return { ok: false, error: "db" };
  const pid = (await p.json().catch(() => []))?.[0]?.id ?? null;
  const when = new Date().toISOString();
  for (const l of due) await db(`leads?id=eq.${l.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ paid_at: when, payout_id: pid }) });
  return { ok: true, amount, count: due.length };
}
