import { createHmac, createHash, scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// ---- Roles. The owner logs in with ADMIN_PASSWORD (no email). Staff are stored in Supabase `staff`.
export const ROLES = {
  owner: { label: "Owner", areas: ["leads", "tours", "settings", "users"] },
  admin: { label: "Admin", areas: ["leads", "tours", "settings", "users"] },
  editor: { label: "Editor (tours)", areas: ["tours"] },
  agent: { label: "Agent (bookings, tours)", areas: ["leads", "tours"] },
};
export const ASSIGNABLE = ["admin", "editor", "agent"];
export const can = (s, area) => !!s && !!ROLES[s.role]?.areas.includes(area);
export const firstArea = (s) => ({ leads: "/admin", tours: "/admin/tours", settings: "/admin/settings", users: "/admin/users" }[ROLES[s?.role]?.areas[0]] || "/admin");

const secret = () => `${process.env.ADMIN_PASSWORD || ""}|${process.env.SUPABASE_SERVICE_KEY || ""}|trip2-admin-v1`;
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const sign = (p) => createHmac("sha256", secret()).update(p).digest("base64url");
export function makeCookie(s) {
  const p = b64({ r: s.role, e: s.email || "", n: s.name || "", i: s.id || 0, x: Date.now() + 7 * 864e5 });
  return `${p}.${sign(p)}`;
}
const eq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

// Current logged-in person (or null). Staff are re-checked in the database so a disabled user is out immediately.
export async function getSession() {
  if (!process.env.ADMIN_PASSWORD) return null;
  const v = (await cookies()).get("adm")?.value;
  if (!v || !v.includes(".")) return null;
  const [p, sig] = v.split(".");
  if (!eq(sig, sign(p))) return null;
  let d; try { d = JSON.parse(Buffer.from(p, "base64url").toString()); } catch { return null; }
  if (!d.x || d.x < Date.now() || !ROLES[d.r]) return null;
  if (d.r === "owner") return { role: "owner", email: "", name: "Owner", id: 0 };
  const st = await findStaffById(d.i);
  if (!st || !st.active || !ROLES[st.role]) return null;
  return { role: st.role, email: st.email, name: st.name, id: st.id };
}

export function passwordOk(p) {
  const a = createHash("sha256").update(String(p || "")).digest(), b = createHash("sha256").update(process.env.ADMIN_PASSWORD || "").digest();
  return !!process.env.ADMIN_PASSWORD && timingSafeEqual(a, b);
}
export const hashPassword = (pw) => { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(String(pw), salt, 64).toString("hex")}`; };
export const checkPassword = (pw, stored) => { const [salt, h] = String(stored || "").split(":"); if (!salt || !h) return false; try { return eq(scryptSync(String(pw), salt, 64).toString("hex"), h); } catch { return false; } };

// ---- Supabase helpers
const base = () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY });
const hdr = (key) => ({ apikey: key, Authorization: `Bearer ${key}` });
async function db(path, init = {}) {
  const { url, key } = base();
  if (!url || !key) return { ok: false, status: 0 };
  try { return await fetch(`${url}/rest/v1/${path}`, { cache: "no-store", ...init, headers: { ...hdr(key), "Content-Type": "application/json", ...(init.headers || {}) } }); } catch { return { ok: false, status: 0 }; }
}
export async function fetchLeads() {
  const { url, key } = base();
  if (!url || !key) return { ok: false, reason: "not-configured", rows: [] };
  const r = await db("leads?select=*&order=created_at.desc&limit=300");
  return r.ok ? { ok: true, rows: await r.json() } : { ok: false, reason: `db-${r.status}`, rows: [] };
}
export async function setStatus(id, status) {
  if (!/^\d+$/.test(String(id)) || !["new", "contacted", "closed"].includes(status)) return false;
  return (await db(`leads?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status }) })).ok;
}

// ---- Staff
export async function listStaff() { const r = await db("staff?select=id,email,name,role,active,created_at,last_login&order=created_at.asc"); return r.ok ? await r.json() : []; }
export async function findStaffById(id) { if (!/^\d+$/.test(String(id))) return null; const r = await db(`staff?id=eq.${id}&select=*`); const j = r.ok ? await r.json() : []; return j[0] || null; }
export async function findStaffByEmail(email) { const r = await db(`staff?email=eq.${encodeURIComponent(String(email).toLowerCase())}&select=*`); const j = r.ok ? await r.json() : []; return j[0] || null; }
export async function addStaff({ email, name, role, password }) {
  return (await db("staff", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ email: String(email).toLowerCase(), name, role, pass: hashPassword(password), active: true }) })).ok;
}
export async function patchStaff(id, patch) { if (!/^\d+$/.test(String(id))) return false; return (await db(`staff?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) })).ok; }
export async function deleteStaff(id) { if (!/^\d+$/.test(String(id))) return false; return (await db(`staff?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } })).ok; }
