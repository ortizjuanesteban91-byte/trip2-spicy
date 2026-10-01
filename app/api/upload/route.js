// Owner photo upload -> Supabase Storage bucket "owner-photos" (created by supabase/schema.sql)
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const hits = new Map(); // tiny per-instance rate limit
export async function POST(req) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
  const ip = (req.headers.get("x-forwarded-for") || "x").split(",")[0];
  const now = Date.now(), recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (recent.length >= 40) return Response.json({ ok: false, reason: "slow-down" }, { status: 429 });
  hits.set(ip, [...recent, now]);
  let f; try { f = (await req.formData()).get("file"); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!f || typeof f === "string" || !TYPES[f.type] || f.size > 4_000_000) return Response.json({ ok: false, reason: "bad-file" }, { status: 400 });
  const d = new Date(), id = crypto.randomUUID();
  const path = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}/${id}.${TYPES[f.type]}`;
  const r = await fetch(`${url}/storage/v1/object/owner-photos/${path}`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": f.type }, body: Buffer.from(await f.arrayBuffer()) });
  if (!r.ok) return Response.json({ ok: false, reason: `storage-${r.status}` }, { status: 502 });
  return Response.json({ ok: true, url: `${url}/storage/v1/object/public/owner-photos/${path}` });
}
