import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { saveSetting } from "@/lib/siteconf";
const ok = (u) => typeof u === "string" && /^(https:\/\/|\/)/.test(u) && u.length < 600;
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "tours")) return Response.json({ ok: false }, { status: 401 });
  let b; try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  const hero = (Array.isArray(b.hero) ? b.hero : []).filter((h) => ok(h?.src)).slice(0, 12).map((h) => ({ src: h.src, alt: String(h.alt || "").slice(0, 160) }));
  const pick = (o) => Object.fromEntries(Object.entries(o && typeof o === "object" ? o : {}).filter(([k, v]) => /^[a-z0-9-]{1,80}$/.test(k) && ok(v)));
  const saved = await saveSetting("photos", { hero, cards: pick(b.cards), cats: pick(b.cats), by: session.name || "Owner" });
  revalidatePath("/", "layout");
  return Response.json({ ok: !!saved }, { status: saved ? 200 : 502 });
}
