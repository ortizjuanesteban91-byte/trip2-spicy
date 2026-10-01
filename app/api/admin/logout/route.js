export async function POST() {
  const res = new Response(null, { status: 303, headers: { Location: "/admin" } });
  res.headers.append("Set-Cookie", "adm=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
  res.headers.append("Set-Cookie", "adm_on=; Path=/; Secure; SameSite=Lax; Max-Age=0");
  return res;
}
