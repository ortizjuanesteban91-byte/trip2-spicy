import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { saveSetting } from "@/lib/siteconf";
import { getReviews, parseLines } from "@/lib/reviews";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "reviews")) return go("/admin");
  const f = await req.formData();
  const cur = await getReviews(true);
  let { items, tripadvisor, google, score, count, taScore, taCount } = cur;
  const act = String(f.get("act") || "");
  if (act === "links") { const l = (k) => (/^https:\/\//.test(String(f.get(k) || "").trim()) ? String(f.get(k)).trim().slice(0, 300) : ""); tripadvisor = l("tripadvisor"); google = l("google"); const sc = Number(String(f.get("score") || "").replace(",", ".")); if (sc > 0 && sc <= 5) score = sc; const ct = Math.floor(Number(f.get("count"))); if (Number.isFinite(ct) && ct >= 0) count = ct; const ts = Number(String(f.get("taScore") || "").replace(",", ".")); taScore = ts > 0 && ts <= 5 ? ts : 0; const tc = Math.floor(Number(f.get("taCount"))); taCount = Number.isFinite(tc) && tc > 0 ? tc : 0; }
  else if (act === "add") items = [...parseLines(f.get("lines")), ...items].slice(0, 200);
  else if (act === "delete") { const i = Number(f.get("i")); items = items.filter((_, k) => k !== i); }
  const ok = await saveSetting("reviews", { items, tripadvisor, google, score, count, taScore, taCount, by: session.name || "Owner" });
  revalidatePath("/", "layout");
  return go(ok ? "/admin/reviews?saved=1" : "/admin/reviews?e=1");
}
