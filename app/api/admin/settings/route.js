import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { saveSetting } from "@/lib/siteconf";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "settings")) return go("/admin");
  const f = await req.formData();
  const email = String(f.get("email") || "").trim().slice(0, 160);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return go("/admin/settings");
  const phone = String(f.get("phone") || "").trim().slice(0, 40);
  const whatsapp = String(f.get("whatsapp") || "").replace(/\D/g, "").slice(0, 20);
  const ok = await saveSetting("site", { email, phone, whatsapp, by: session.name || "Owner" });
  revalidatePath("/", "layout");
  return go(ok ? "/admin/settings?saved=1" : "/admin/settings");
}
