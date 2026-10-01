import { SITE } from "@/lib/site";
import { tours, posts } from "@/lib/content";
export default function sitemap() {
  return [...["", "/tours", "/travel-tips", "/blog", "/contact", ...["water-adventures","adventure-safari","family-experiences","eco-nature","culture-city","things-to-do-in-miches"].map((c) => `/tours/${c}`)].map((p) => ({ url: `${SITE}${p}` })), ...tours.map((t) => ({ url: `${SITE}/tour/${t.slug}/` })), ...posts.map((b) => ({ url: `${SITE}/blog/${b.slug}/` }))];
}
