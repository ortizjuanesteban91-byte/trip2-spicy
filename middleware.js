import { NextResponse } from "next/server";
import { isMichesHost } from "@/lib/miches";
// Affiliate links: any page with ?ref=CODE remembers the code for 30 days. The booking route checks it is a real, approved affiliate.
// michestour.com: its home page "/" shows the Miches landing (/m); every other page is the normal site.
export function middleware(req) {
  const ref = req.nextUrl.searchParams.get("ref");
  let res = NextResponse.next();
  if (req.nextUrl.pathname === "/" && isMichesHost(req.headers.get("host"))) { const u = req.nextUrl.clone(); u.pathname = "/m"; res = NextResponse.rewrite(u); }
  if (ref && /^[a-z0-9]{4,24}$/i.test(ref)) res.cookies.set("aff", ref.toLowerCase(), { maxAge: 30 * 86400, path: "/", sameSite: "lax", secure: true });
  return res;
}
export const config = { matcher: ["/((?!api|admin|_next|img|.*\\..*).*)"] };
