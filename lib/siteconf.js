// Settings stored in Supabase `settings` (one row per key). Falls back to defaults when Supabase is not connected.
import { email as DEFAULT_EMAIL } from "@/data/site";
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
// Email that receives booking alerts.
export async function getSite(fresh = false) {
  const d = (await getSetting("site", fresh)) || {};
  return { email: typeof d.email === "string" && d.email.trim() ? d.email.trim() : DEFAULT_EMAIL };
}
