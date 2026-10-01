import { SITE } from "@/lib/site";
import { tours, posts } from "@/lib/content";
export default function sitemap() {
  return [...["", "/tours", "/travel-tips", "/blog", "/contact"].map((p) => ({ url: `${SITE}${p}` })), ...tours.map((t) => ({ url: `${SITE}/tour/${t.slug}/` })), ...posts.map((b) => ({ url: `${SITE}/blog/${b.slug}/` }))];
}
