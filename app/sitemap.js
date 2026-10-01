import { SITE } from "@/lib/site";
import { tours } from "@/data/site";
export default function sitemap() {
  return [...["", "/tours", "/travel-tips", "/blog", "/contact"].map((p) => ({ url: `${SITE}${p}` })), ...tours.map((t) => ({ url: `${SITE}/tours/${t.slug}` }))];
}
