// Blog = built-in posts (data/posts.json) overlaid by posts written/edited in /admin (Supabase `posts` table: slug, hidden, data).
import base from "@/data/posts.json";
const conf = () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY });
async function rows(fresh) {
  const { url, key } = conf();
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/posts?select=*`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, ...(fresh ? { cache: "no-store" } : { next: { revalidate: 60, tags: ["posts"] } }) });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}
const paras = (v) => String(v || "").split(/\r?\n\s*\r?\n/).map((x) => x.trim()).filter(Boolean);
// "## Heading" starts a section; other blocks are paragraphs
export function parseBody(body = "") {
  const out = []; let cur = null;
  for (const blk of paras(body)) {
    if (blk.startsWith("## ")) { const [h, ...rest] = blk.split(/\r?\n/); cur = { type: "text", h2: h.slice(3).trim(), paras: rest.join(" ").trim() ? [rest.join(" ").trim()] : [] }; out.push(cur); }
    else { if (!cur) { cur = { type: "text", h2: "", paras: [] }; out.push(cur); } cur.paras.push(blk); }
  }
  return out;
}
export const sectionsToBody = (sections = []) => sections.filter((s) => s.type === "text").map((s) => [s.h2 ? `## ${s.h2}` : "", ...(s.paras || [])].filter(Boolean).join("\n\n")).join("\n\n");
function merge(b, row) {
  const d = row?.data || {};
  const h1 = d.title ?? b?.h1 ?? "";
  const intro = d.intro !== undefined ? paras(d.intro) : b?.intro || [];
  const meta = d.meta || b?.meta || intro.join(" ").slice(0, 155);
  return {
    ...(b || { alts: [] }),
    slug: row?.slug || b.slug, h1, title: h1, metaTitle: d.metaTitle || (d.title ? `${d.title} | Trip2` : b?.metaTitle) || h1,
    meta, intro, image: d.image || "", hidden: !!row?.hidden, by: d.by || "", fromDb: !!row, builtin: !!b,
    sections: d.body !== undefined ? parseBody(d.body) : b?.sections || [],
  };
}
export async function allPosts({ includeHidden = false, fresh = false } = {}) {
  const rs = await rows(fresh);
  const by = new Map(rs.map((r) => [r.slug, r]));
  const out = base.map((b) => merge(b, by.get(b.slug)));
  rs.filter((r) => !base.some((b) => b.slug === r.slug)).reverse().forEach((r) => out.unshift(merge(null, r)));
  return includeHidden ? out : out.filter((p) => !p.hidden);
}
export async function getPost(slug, opts) { return (await allPosts(opts)).find((p) => p.slug === slug) || null; }
export async function savePost(slug, { hidden, data }) {
  const { url, key } = conf();
  if (!url || !key) return false;
  const r = await fetch(`${url}/rest/v1/posts?on_conflict=slug`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ slug, hidden: !!hidden, data, updated_at: new Date().toISOString() }]) });
  return r.ok;
}
export async function deletePost(slug) {
  const { url, key } = conf();
  if (!url || !key) return false;
  return (await fetch(`${url}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "return=minimal" } })).ok;
}
