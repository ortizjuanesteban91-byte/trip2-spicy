// Settings stored in Supabase `settings` (one row per key). Falls back to defaults when Supabase is not connected.
import { email as DEFAULT_EMAIL, phone as DEFAULT_PHONE, whatsapp as DEFAULT_WA } from "@/data/site";
const conf = () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY });
export async function getSetting(key, fresh = false) {
  const { url, key: k } = conf();
  if (!url || !k) return null;
  try {
    const r = await fetch(`${url}/rest/v1/settings?key=eq.${encodeURIComponent(key)}&select=data`, { headers: { apikey: k, Authorization: `Bearer ${k}` }, ...(fresh ? { cache: "no-store" } : { next: { revalidate: 60, tags: ["settings"] } }) });
    const j = r.ok ? await r.json() : [];
    return j[0]?.data || null;
  } catch { return null; }
}
export async function saveSetting(key, data) {
  const { url, key: k } = conf();
  if (!url || !k) return false;
  const r = await fetch(`${url}/rest/v1/settings?on_conflict=key`, { method: "POST", headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ key, data, updated_at: new Date().toISOString() }]) });
  return r.ok;
}
// Contact details used across the site (editable in /admin > Settings). Email also receives booking alerts.
export async function getSite(fresh = false) {
  const d = (await getSetting("site", fresh)) || {};
  const str = (v, def) => (typeof v === "string" && v.trim() ? v.trim() : def);
  const wa = String(d.whatsapp || "").replace(/\D/g, "") || DEFAULT_WA.replace(/\D/g, "");
  return { email: str(d.email, DEFAULT_EMAIL), phone: str(d.phone, DEFAULT_PHONE), whatsapp: wa, wa: `https://wa.me/${wa}` };
}
export const waLink = (site, text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Recent rows whose key starts with a prefix (used for saved chats).
export async function listSettings(prefix, limit = 60) {
  const { url, key: k } = conf();
  if (!url || !k) return [];
  try {
    const r = await fetch(`${url}/rest/v1/settings?key=like.${encodeURIComponent(prefix)}*&select=key,data,updated_at&order=updated_at.desc&limit=${limit}`, { headers: { apikey: k, Authorization: `Bearer ${k}` }, cache: "no-store" });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}
