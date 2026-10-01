import { getSession } from "@/lib/admin";
// Tells the website whether the visitor is a logged-in admin (to show the Dashboard button). Sets the marker cookie.
export async function GET() {
  const s = await getSession();
  const res = Response.json({ admin: !!s }, { headers: { "Cache-Control": "no-store" } });
  if (s) res.headers.append("Set-Cookie", "adm_on=1; Path=/; Secure; SameSite=Lax; Max-Age=604800");
  return res;
}
