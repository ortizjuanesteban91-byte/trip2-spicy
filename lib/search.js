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
// Voice-typing / common misspellings of tour words.
const ALIAS = { sauna: "saona", sona: "saona", saoma: "saona", sahona: "saona", bavaro: "bavaro", buggie: "buggy", bugy: "buggy", zipline: "zip", ziplines: "zip", "zip-line": "zip" };
const words_of = (q) => norm(q).split(/[^a-z0-9]+/).filter(Boolean).map((w) => ALIAS[w] || w);
const own = (t) => t._o || (t._o = norm([t.name, t.title, t.h1, t.keyword, t.slug.replace(/-/g, " ")].join(" ")));
// Exact first: if the words are literally in tour names, return ONLY those tours.
// Only when nothing matches by name do we widen with synonyms (buggy -> ATV, etc.).
// Place-type words that should list every matching destination, not only names containing the literal word.
const UNION = { city: ["city", "santo domingo", "samana", "higuey", "la romana", "chavon"], cities: ["city", "santo domingo", "samana", "higuey", "la romana", "chavon"], ciudad: ["city", "santo domingo", "samana", "higuey", "la romana", "chavon"] };
export function filterTours(list, q) {
  const words = words_of(q);
  if (!words.length) return list;
  if (words.length === 1 && UNION[words[0]]) { const u = list.filter((t) => UNION[words[0]].some((x) => own(t).includes(x))); if (u.length) return u; }
  const strict = list.filter((t) => words.every((w) => own(t).includes(w)));
  if (strict.length) return strict;
  return list.filter((t) => matches(t, q));
}
export function matches(t, q) {
  const words = words_of(q);
  if (!words.length) return true;
  const h = t._h || (t._h = hay(t));
  return words.every((w) => h.includes(w) || (SYN[w] || []).some((s) => h.includes(s)));
}
