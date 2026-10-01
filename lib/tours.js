// Tours = built-in tours (data/tours.json) + edits saved from /admin (Supabase `tours` table: slug, hidden, data).
// Editable from admin: show/hide, "From" price, option prices (incl. weekend price), photos. Everything else stays in the generated content.
import base from "@/data/tours.json";
const conf = () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY });

export async function dbTours(fresh = false) {
  const { url, key } = conf();
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/tours?select=*`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, ...(fresh ? { cache: "no-store" } : { next: { revalidate: 60, tags: ["tours"] } }) });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}
function merge(t, row) {
  const d = row?.data || {};
  const options = (t.options || []).map((o, i) => {
    const od = d.options?.[i] || {};
    const price = Number(od.price);
    const wk = od.priceWknd === "" || od.priceWknd === undefined ? undefined : Number(od.priceWknd);
    return { ...o, ...(price > 0 ? { price } : {}), ...(wk > 0 ? { priceWknd: wk } : {}) };
  });
  const from = Number(d.from) > 0 ? Number(d.from) : t.from;
  return { ...t, options, from, hidden: !!row?.hidden, photos: Array.isArray(d.photos) && d.photos.length ? d.photos : null, edited: !!row, by: d.by || "", updatedAt: row?.updated_at || "" };
}
export async function allTours({ includeHidden = false, fresh = false } = {}) {
  const rows = await dbTours(fresh);
  const by = new Map(rows.map((r) => [r.slug, r]));
  const out = base.map((t) => merge(t, by.get(t.slug)));
  return includeHidden ? out : out.filter((t) => !t.hidden);
}
export async function getTour(slug, opts) { return (await allTours(opts)).find((t) => t.slug === slug) || null; }
export async function saveTour(slug, { hidden, data }) {
  const { url, key } = conf();
  if (!url || !key) return false;
  const r = await fetch(`${url}/rest/v1/tours?on_conflict=slug`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ slug, hidden: !!hidden, data, updated_at: new Date().toISOString() }]) });
  return r.ok;
}

// Private supplier info (never sent to the public pages): supplier name, cost per option, affiliate commission % for this tour.
export async function tourPrivate(slug) {
  const row = (await dbTours(true)).find((r) => r.slug === slug);
  const d = row?.data || {};
  const num = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
  return { supplier: String(d.supplier || ""), costs: Array.isArray(d.costs) ? d.costs.map(num) : [], rate: num(d.rate) };
}
