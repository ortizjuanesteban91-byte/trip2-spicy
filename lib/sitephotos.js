// Photos chosen in /admin > Photos (stored in Supabase settings, key "photos"). Falls back to the built-in defaults.
import { getSetting } from "@/lib/siteconf";
import { bigPhoto } from "@/data/photos";
const CLH = "https://res.cloudinary.com/o3hobtr4/image/upload/f_auto,q_auto:best,w_2200,c_limit/";
export const DEFAULT_HERO = [
  { src: bigPhoto("saona-island", 2200), alt: "Aerial view of Saona Island beach and turquoise water" },
  { src: "/tours/monkeyland-06.webp", alt: "Squirrel monkey and zipline at Monkey Land, Punta Cana" },
  { src: "/tours/bavaro-06.webp", alt: "Buggy tour in Punta Cana" },
  { src: "/tours/parasail-01.webp", alt: "Parasailing over the turquoise sea in Punta Cana" },
  { src: bigPhoto("los-haitises", 2200), alt: "Aerial view of Los Haitises National Park" },
  { src: CLH + "image00020", alt: "Friends enjoying a catamaran party boat in Punta Cana" },
];
const clean = (u) => (typeof u === "string" && /^(https:\/\/|\/)/.test(u.trim()) ? u.trim().slice(0, 600) : "");
export async function getSitePhotos(fresh = false) {
  const d = (await getSetting("photos", fresh)) || {};
  const hero = (Array.isArray(d.hero) ? d.hero : []).map((h) => ({ src: clean(h?.src), alt: String(h?.alt || "Punta Cana excursions").slice(0, 160) })).filter((h) => h.src).slice(0, 12);
  const map = (o) => Object.fromEntries(Object.entries(o && typeof o === "object" ? o : {}).map(([k, v]) => [k, clean(v)]).filter(([, v]) => v));
  return { hero: hero.length ? hero : DEFAULT_HERO, customHero: hero.length > 0, cards: map(d.cards), cats: map(d.cats) };
}
