import { affiliateByEmail, checkPassword, makeAffCookie } from "@/lib/affiliates";
export async function POST(req) {
  const f = await req.formData();
  await new Promise((r) => setTimeout(r, 600));
  const a = await affiliateByEmail(String(f.get("email") || "").trim());
  const ok = a && checkPassword(String(f.get("password") || ""), a.pass);
  if (!ok) return new Response(null, { status: 303, headers: { Location: "/affiliates?e=login#login" } });
  if (a.status !== "approved") return new Response(null, { status: 303, headers: { Location: `/affiliates?e=${a.status}#login` } });
  const res = new Response(null, { status: 303, headers: { Location: "/affiliates/dashboard" } });
  res.headers.append("Set-Cookie", `aff_s=${makeAffCookie(a.id)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1209600`);
  return res;
}
