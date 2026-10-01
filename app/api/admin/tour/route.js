import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { getTour, saveTour } from "@/lib/tours";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
const num = (v) => { const n = Number(String(v ?? "").replace(",", ".")); return Number.isFinite(n) && n >= 0 && n < 100000 ? n : null; };
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "tours")) return go("/admin");
  const f = await req.formData();
  const slug = String(f.get("slug") || "");
  const t = await getTour(slug, { includeHidden: true, fresh: true });
  if (!t) return go("/admin/tours");
  const options = t.options.map((_, i) => ({ price: num(f.get(`price_${i}`)) ?? "", priceWknd: num(f.get(`wknd_${i}`)) || "" }));
  const photos = String(f.get("photos") || "").split(/\s+/).filter((u) => /^https:\/\//.test(u)).slice(0, 40);
  const data = { from: num(f.get("from")) || "", options, photos, by: session.name || "Owner" };
  const ok = await saveTour(slug, { hidden: f.get("hidden") === "on", data });
  revalidatePath("/", "layout");
  return go(ok ? "/admin/tours?saved=1" : `/admin/tours/${slug}?e=1`);
}
