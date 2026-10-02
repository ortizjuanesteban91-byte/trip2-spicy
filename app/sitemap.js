import { headers } from "next/headers";
import { SITE } from "@/lib/site";
import { isMichesHost, MICHES_URL } from "@/lib/miches";
import { allPosts } from "@/lib/posts";
import { allTours } from "@/lib/tours";
export default async function sitemap() {
  if (isMichesHost((await headers()).get("host"))) return [{ url: `${MICHES_URL}/` }]; // michestour.com: only its own landing (tour pages canonical to the main site)
  const tours = await allTours();
  const posts = await allPosts();
  return [...["", "/tours", "/travel-tips", "/blog", "/contact", "/airport-transfer", "/about", ...["water-adventures","adventure-safari","family-experiences","eco-nature","culture-city","shows-nightlife","things-to-do-in-miches"].map((c) => `/tours/${c}`)].map((p) => ({ url: `${SITE}${p}` })), ...tours.map((t) => ({ url: `${SITE}/tour/${t.slug}/` })), ...posts.map((b) => ({ url: `${SITE}/blog/${b.slug}/` }))];
}
