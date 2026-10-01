// Real guest reviews added by the owner in /admin > Reviews (stored in Supabase `settings`, key "reviews").
// Nothing is shown unless the owner adds it. No overall score is calculated or published.
import { getSetting } from "@/lib/siteconf";
// Trip2 Google Business place (from the owner's "write a review" link)
export const GOOGLE_PLACE = "ChIJJ4ntKKiVqI4RsHUZeQSE4jk";
export const GOOGLE_READ = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE}`;
export const GOOGLE_WRITE = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE}`;
// TripAdvisor "write a review" link for Funtrip2 Punta Cana (from the owner)
export const TA_WRITE = "https://www.tripadvisor.com/UserReviewEdit-g147293-d19275885-Funtrip2PuntaCana-Punta_Cana_La_Altagracia_Province_Dominican_Republic.html";
// TripAdvisor public page (from the owner)
export const TA_PAGE = "https://www.tripadvisor.com/Attraction_Review-g147293-d19275885-Reviews-Funtrip2PuntaCana-Punta_Cana_La_Altagracia_Province_Dominican_Republic.html";
export const SOURCES = ["Google", "TripAdvisor", "Direct", "Other"];
export async function getReviews(fresh = false) {
  const d = (await getSetting("reviews", fresh)) || {};
  const items = (Array.isArray(d.items) ? d.items : []).filter((r) => r && r.text && r.name);
  const link = (v) => (/^https:\/\//.test(String(v || "")) ? String(v) : "");
  // Google rating as shown on the owner's Google Business Profile (5.0 / 134 on 2026-10-01); editable in /admin > Reviews.
  const score = Number(d.score) > 0 && Number(d.score) <= 5 ? Number(d.score) : 5;
  const count = Number.isFinite(Number(d.count)) && d.count !== undefined && d.count !== "" ? Math.max(0, Math.floor(Number(d.count))) : 134;
  // TripAdvisor rating as shown on the public page (4.9 / 47 on 2026-10-01); editable in /admin > Reviews, set reviews to 0 to hide.
  const taScore = d.taCount === 0 || d.taScore === 0 ? 0 : Number(d.taScore) > 0 && Number(d.taScore) <= 5 ? Number(d.taScore) : 4.9;
  const taCount = d.taCount === 0 || d.taScore === 0 ? 0 : Number.isFinite(Number(d.taCount)) && Number(d.taCount) > 0 ? Math.floor(Number(d.taCount)) : 47;
  return { score, count, taScore, taCount, items, tripadvisor: link(d.tripadvisor) || TA_PAGE, google: link(d.google) || GOOGLE_READ };
}
// One review per line:  Name | Country | Stars | Source | Date | Review text
export function parseLines(txt) {
  return String(txt || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, country, stars, source, date, ...rest] = l.split("|").map((x) => x.trim());
    const text = rest.join(" | ").trim();
    const s = Math.max(1, Math.min(5, Math.round(Number(stars)) || 5));
    return name && text ? { name: name.slice(0, 80), country: (country || "").slice(0, 60), stars: s, source: SOURCES.includes(source) ? source : "Other", date: (date || "").slice(0, 20), text: text.slice(0, 1200) } : null;
  }).filter(Boolean);
}
