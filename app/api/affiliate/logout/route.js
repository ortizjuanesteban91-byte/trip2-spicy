export async function POST() {
  const res = new Response(null, { status: 303, headers: { Location: "/affiliates" } });
  res.headers.append("Set-Cookie", "aff_s=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
  return res;
}
