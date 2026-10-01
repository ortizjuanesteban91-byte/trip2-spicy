import { getSession, can } from "@/lib/admin";
import { affiliateById, patchAffiliate, setCompleted, payAffiliate } from "@/lib/affiliates";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "affiliates")) return go("/admin");
  const f = await req.formData();
  const act = String(f.get("act") || ""), back = String(f.get("back") || "/admin/affiliates");
  const dest = ["/admin", "/admin/affiliates"].includes(back) ? back : "/admin/affiliates";
  if (act === "complete" || act === "uncomplete") { await setCompleted(f.get("lead"), act === "complete"); return go(dest); }
  const a = await affiliateById(f.get("id"));
  if (!a) return go(dest);
  if (act === "approve") await patchAffiliate(a.id, { status: "approved" });
  else if (act === "disable") await patchAffiliate(a.id, { status: "disabled" });
  else if (act === "pay") await payAffiliate(a, `Paid by ${session.name || "Owner"}`);
  return go(dest);
}
