import { SITE, isLive } from "@/lib/site";
export default function robots() {
  if (!isLive) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api"] }], sitemap: `${SITE}/sitemap.xml` };
}
