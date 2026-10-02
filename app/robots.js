import { headers } from "next/headers";
import { SITE, isLive } from "@/lib/site";
import { isMichesHost, michesLive, MICHES_URL } from "@/lib/miches";
export default async function robots() {
  if (isMichesHost((await headers()).get("host"))) {
    if (!michesLive) return { rules: [{ userAgent: "*", disallow: "/" }] };
    return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api", "/admin"] }], sitemap: `${MICHES_URL}/sitemap.xml` };
  }
  if (!isLive) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api", "/admin"] }], sitemap: `${SITE}/sitemap.xml` };
}
