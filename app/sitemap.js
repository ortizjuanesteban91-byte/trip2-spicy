import { SITE } from "@/lib/site";
import { posts } from "@/lib/content";
import { allTours } from "@/lib/tours";
export default async function sitemap() {
  const tours = await allTours();
  return [...["", "/tours", "/travel-tips", "/blog", "/contact", ...["water-adventures","adventure-safari","family-experiences","eco-nature","culture-city","shows-nightlife","things-to-do-in-miches"].map((c) => `/tours/${c}`)].map((p) => ({ url: `${SITE}${p}` })), ...tours.map((t) => ({ url: `${SITE}/tour/${t.slug}/` })), ...posts.map((b) => ({ url: `${SITE}/blog/${b.slug}/` }))];
}
