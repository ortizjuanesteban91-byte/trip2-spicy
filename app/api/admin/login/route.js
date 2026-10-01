import { passwordOk, makeCookie, findStaffByEmail, checkPassword, patchStaff } from "@/lib/admin";
export async function POST(req) {
  const f = await req.formData();
  await new Promise((r) => setTimeout(r, 600)); // slow down guessing
  const email = String(f.get("email") || "").trim().toLowerCase(), pw = String(f.get("password") || "");
  let session = null;
  if (!email || email === "owner") { if (passwordOk(pw)) session = { role: "owner" }; }
  else {
    const st = await findStaffByEmail(email);
    if (st && st.active && checkPassword(pw, st.pass)) { session = { role: st.role, email: st.email, name: st.name, id: st.id }; patchStaff(st.id, { last_login: new Date().toISOString() }); }
  }
  const res = new Response(null, { status: 303, headers: { Location: session ? "/admin" : "/admin?e=1" } });
  if (session) res.headers.append("Set-Cookie", `adm=${makeCookie(session)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);
  if (session) res.headers.append("Set-Cookie", "adm_on=1; Path=/; Secure; SameSite=Lax; Max-Age=604800");
  return res;
}
