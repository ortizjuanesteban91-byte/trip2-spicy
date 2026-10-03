// Shared tour search: accent-insensitive, every word must match, with synonyms
// (buggy finds ATV/Polaris/quad, bavaro finds Bávaro, boat finds catamaran, etc.).
export const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const GROUPS = [
  ["buggy", "buggies", "atv", "polaris", "quad", "quads", "dune", "offroad", "off-road", "safari"],
  ["zip", "zipline", "ziplines", "zip-line", "canopy"],
  ["boat", "catamaran", "speedboat", "sailing", "cruise", "yacht", "snorkel", "snorkeling"],
  ["horse", "horses", "horseback", "riding", "ranch"],
  ["dolphin", "dolphins", "swim"],
  ["saona", "island", "beach"],
  ["transfer", "transfers", "airport", "taxi", "shuttle", "pickup"],
  ["party", "nightlife", "club", "bar"],
  ["fish", "fishing", "charter"],
  ["parasail", "parasailing", "flyboard", "watersports"],
  ["santo", "domingo", "city", "colonial"],
];
const SYN = {};
for (const g of GROUPS) for (const w of g) SYN[w] = g;
export const hay = (t) => norm([t.name, t.title, t.h1, t.keyword, t.slug.replace(/-/g, " "), t.meta, t.catLabel].join(" "));
export function matches(t, q) {
  const words = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
  if (!words.length) return true;
  const h = t._h || (t._h = hay(t));
  return words.every((w) => h.includes(w) || (SYN[w] || []).some((s) => h.includes(s)));
}
