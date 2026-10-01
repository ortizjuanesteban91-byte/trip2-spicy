import tours from "@/data/tours.json";
import posts from "@/data/posts.json";
export { tours, posts };
export const GRADS = ["from-sky-300 to-teal-700","from-emerald-300 to-emerald-800","from-amber-200 to-lime-700","from-cyan-200 to-blue-700","from-green-300 to-teal-800","from-slate-300 to-slate-700"];
export const grad = (i) => GRADS[i % GRADS.length];
export const tourBySlug = (s) => tours.find((t) => t.slug === s);
export const postBySlug = (s) => posts.find((t) => t.slug === s);
export const tourHref = (s) => `/tour/${s}`;

export const CATS = [["water", "Water Adventures"], ["adventure", "Adventure & Safari"], ["family", "Family Experiences"], ["eco", "Eco & Nature"], ["culture", "Culture & City"]];
const MAP = { family: ["dolphin-explorer", "monkeyland"], eco: ["los-haitises", "whale-watching-cayo-levantado", "whale-watching-el-limon", "whale-watching-half-day", "el-limon-cayo-levantado"], culture: ["santo-domingo", "higuey-city-tour"], water: ["catamaran-party-boat", "catamaran-parasailing-snorkeling", "hip-hop-party-boat", "speedboat", "speedboat-parasailing-snorkeling", "parasailing", "deep-sea-fishing", "saona-island", "catalina-island", "playa-rincon-cayo-levantado"] };
export const catOf = (slug) => (Object.entries(MAP).find(([, v]) => v.includes(slug)) || ["adventure"])[0];
const ALSO = { family: ["monkeyland-zipline"] };
export const catsOf = (slug) => [catOf(slug), ...Object.entries(ALSO).filter(([, v]) => v.includes(slug)).map(([k]) => k)];
