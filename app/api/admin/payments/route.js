import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { saveSetting } from "@/lib/siteconf";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "settings")) return go("/admin");
  const f = await req.formData();
  const pct = [100, 50, 30, 20].includes(Number(f.get("deposit_pct"))) ? Number(f.get("deposit_pct")) : 100;
  const ok = await saveSetting("payments", { online_enabled: f.get("online_enabled") === "on", deposit_pct: pct, by: session.name || "Owner" });
  revalidatePath("/", "layout");
  return go(ok ? "/admin/settings?saved=1" : "/admin/settings");
}
