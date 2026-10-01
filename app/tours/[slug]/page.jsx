import { notFound } from "next/navigation";
import { tours } from "@/data/site";
import { SITE } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
export function generateStaticParams() { return tours.map((t) => ({ slug: t.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = tours.find((x) => x.slug === slug);
  if (!t) return {};
  return { title: `${t.title} | Trip2 Spicy`, description: `${t.title}. From ${t.price} per person. Verified local guide, 24h free cancellation and WhatsApp concierge.`, alternates: { canonical: `${SITE}/tours/${t.slug}` } };
}
export default async function Tour({ params }) {
  const { slug } = await params;
  const t = tours.find((x) => x.slug === slug);
  if (!t) notFound();
  const ld = { "@context": "https://schema.org", "@type": "TouristTrip", name: t.title, url: `${SITE}/tours/${t.slug}`, offers: { "@type": "Offer", price: t.price.replace(/[^0-9.]/g, ""), priceCurrency: "USD" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "100" } };
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="h-72 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-700" />
      <h1 className="mt-6 text-3xl font-black text-brand">{t.title}</h1>
      <p className="mt-2 text-ink/70">Half Day · Verified Guide · ★ 4.9 (100+)</p>
      <p className="mt-4 text-2xl font-black">From {t.price} <span className="text-sm font-normal">/ person</span></p>
      <h2 className="mt-10 mb-3 text-2xl font-black text-brand">Book this tour</h2>
      <LeadForm kind="booking" intro="Reserve now and pay later. Free cancellation up to 24 hours before." fields={[{ name: "Tour", label: "Tour", type: "text" }, { name: "Date", label: "Preferred date", type: "text", required: true }, { name: "Guests", label: "Number of guests", type: "text", required: true }, { name: "Hotel", label: "Hotel name", type: "text" }, { name: "Notes", label: "Notes", type: "textarea" }]} />
    </main>
  );
}
