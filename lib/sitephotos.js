// Photos chosen in /admin > Photos (stored in Supabase settings, key "photos"). Falls back to the built-in defaults.
import { getSetting } from "@/lib/siteconf";
import { bigPhoto } from "@/data/photos";
const CLH = "https://res.cloudinary.com/o3hobtr4/image/upload/f_auto,q_auto:best,w_2200,c_limit/";
export const DEFAULT_HERO = [
  { src: "/hero/hero-01.webp", alt: "Catamaran cruising the Caribbean off Saona Island" },
  { src: "/hero/hero-02.webp", alt: "Saona Island palm beach seen from above" },
  { src: "/hero/hero-03.webp", alt: "Parasailing over Bávaro Beach, Punta Cana" },
  { src: "/hero/hero-04.webp", alt: "Buggy adventure in Punta Cana" },
  { src: "/hero/hero-05.webp", alt: "Catalina Island beach and boats near Punta Cana" },
  { src: "/hero/hero-06.webp", alt: "Hip hop party boat in Punta Cana" },
  { src: "/hero/hero-07.webp", alt: "Los Haitises National Park bay and mangroves" },
  { src: "/hero/hero-08.webp", alt: "Guests celebrating in the turquoise water at Saona natural pool" },
];
const clean = (u) => (typeof u === "string" && /^(https:\/\/|\/)/.test(u.trim()) ? u.trim().slice(0, 600) : "");
export async function getSitePhotos(fresh = false) {
  const d = (await getSetting("photos", fresh)) || {};
  const hero = (Array.isArray(d.hero) ? d.hero : []).map((h) => ({ src: clean(h?.src), alt: String(h?.alt || "Punta Cana excursions").slice(0, 160) })).filter((h) => h.src).slice(0, 12);
  const map = (o) => Object.fromEntries(Object.entries(o && typeof o === "object" ? o : {}).map(([k, v]) => [k, clean(v)]).filter(([, v]) => v));
  return { hero: hero.length ? hero : DEFAULT_HERO, customHero: hero.length > 0, cards: map(d.cards), cats: map(d.cats) };
}
