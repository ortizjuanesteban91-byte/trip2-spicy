import { NextResponse } from "next/server";
// Affiliate links: any page with ?ref=CODE remembers the code for 30 days. The booking route checks it is a real, approved affiliate.
export function middleware(req) {
  const ref = req.nextUrl.searchParams.get("ref");
  const res = NextResponse.next();
  if (ref && /^[a-z0-9]{4,24}$/i.test(ref)) res.cookies.set("aff", ref.toLowerCase(), { maxAge: 30 * 86400, path: "/", sameSite: "lax", secure: true });
  return res;
}
export const config = { matcher: ["/((?!api|admin|_next|img|.*\\..*).*)"] };
