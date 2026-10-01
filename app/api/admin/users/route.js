import { getSession, can, ASSIGNABLE, addStaff, findStaffByEmail, patchStaff, deleteStaff, hashPassword } from "@/lib/admin";
const go = (m) => new Response(null, { status: 303, headers: { Location: `/admin/users?m=${m}` } });
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "users")) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  const f = await req.formData();
  const a = String(f.get("action") || ""), id = String(f.get("id") || "");
  const role = ASSIGNABLE.includes(String(f.get("role"))) ? String(f.get("role")) : "editor";
  if (a === "add") {
    const name = String(f.get("name") || "").trim().slice(0, 80), email = String(f.get("email") || "").trim().toLowerCase().slice(0, 160), pw = String(f.get("password") || "");
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || pw.length < 8) return go("bad");
    if (await findStaffByEmail(email)) return go("exists");
    return go((await addStaff({ email, name, role, password: pw })) ? "ok" : "db");
  }
  if (a === "role") return go((await patchStaff(id, { role })) ? "ok" : "db");
  if (a === "disable") return go((await patchStaff(id, { active: false })) ? "ok" : "db");
  if (a === "enable") return go((await patchStaff(id, { active: true })) ? "ok" : "db");
  if (a === "password") { const pw = String(f.get("password") || ""); if (pw.length < 8) return go("bad"); return go((await patchStaff(id, { pass: hashPassword(pw) })) ? "ok" : "db"); }
  if (a === "delete") return go((await deleteStaff(id)) ? "ok" : "db");
  return go("bad");
}
