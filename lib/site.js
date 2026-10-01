export const SITE = "https://trip2-spicy.vercel.app";
// Search engines are blocked until SITE_LIVE=1 is set in Vercel (launch day only).
export const isLive = process.env.SITE_LIVE === "1";
export const robotsMeta = isLive ? { index: true, follow: true } : { index: false, follow: false };
export const agencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Trip2 Spicy",
  url: SITE,
  email: "info@trip2puntacana.com",
  address: { "@type": "PostalAddress", addressLocality: "Bávaro", addressRegion: "La Altagracia", addressCountry: "DO" },
  areaServed: ["Punta Cana", "Bávaro", "Miches", "Saona Island"],
};
