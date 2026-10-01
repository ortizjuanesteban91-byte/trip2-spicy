import { notFound } from "next/navigation";
import Link from "next/link";
import { tours, tourBySlug, grad } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import Sections from "@/components/Sections";
export function generateStaticParams() { return tours.map((t) => ({ slug: t.slug })); }
export async function generateMetadata({ params }) {
  const t = tourBySlug((await params).slug);
  if (!t) return {};
  const url = `${SITE}/tour/${t.slug}/`;
  return { title: t.metaTitle, description: t.meta, alternates: { canonical: url }, openGraph: { title: t.metaTitle, description: t.meta, url } };
}
export default async function Tour({ params }) {
  const t = tourBySlug((await params).slug);
  if (!t) notFound();
  const i = tours.indexOf(t);
  const faq = t.sections.find((s) => s.type === "faq");
  const ld = [
    { "@context": "https://schema.org", "@type": "TouristTrip", name: t.h1, description: t.meta, url: `${SITE}/tour/${t.slug}/`, offers: t.from ? { "@type": "Offer", price: String(t.from), priceCurrency: "USD", availability: "https://schema.org/InStock" } : undefined, provider: { "@type": "TravelAgency", name: "Trip2 Punta Cana" } },
    faq && { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ].filter(Boolean);
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      {ld.map((o, k) => <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <p className="mb-3 text-xs text-ink/60"><Link href="/" className="hover:text-brand">Home</Link> › <Link href="/tours" className="hover:text-brand">Tours</Link> › {t.name}</p>
      <div data-aos="zoom-in" className={`h-64 rounded-2xl bg-gradient-to-br sm:h-80 ${grad(i)}`} role="img" aria-label={t.alts[0] || t.h1} />
      <h1 className="mt-6 text-3xl font-black text-brand" data-aos="zoom-out-left">{t.h1}</h1>
      <div className="mt-4 rounded-2xl bg-ice p-5" data-aos="zoom-out-right">
        {t.from && <p className="text-2xl font-black">From ${t.from} <span className="text-sm font-normal text-ink/60">/ person</span></p>}
        {t.prices && <p className="mt-1 text-sm text-ink/70">{t.prices}</p>}
        <div className="mt-3 flex flex-wrap gap-2"><a href="#book" className="rounded-full bg-brand px-6 py-2.5 text-xs font-extrabold text-white hover:bg-brand-hover">BOOK NOW</a><a href={whatsappLink(`Hi, I'd like to book: ${t.h1}`)} className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-extrabold text-white">WHATSAPP</a></div>
      </div>
      <div className="mt-6" data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
      <Sections sections={t.sections} />
      <section id="book" className="mt-12" data-aos="zoom-in">
        <h2 className="mb-3 text-2xl font-black text-brand">Book this tour</h2>
        <LeadForm kind="booking" intro="Reserve now and pay later. We confirm your pickup time on WhatsApp." fields={[{ name: "Tour", label: "Tour", type: "text", defaultValue: t.name }, { name: "Date", label: "Preferred date", type: "text", required: true }, { name: "Guests", label: "Number of guests", type: "text", required: true }, { name: "Hotel", label: "Hotel name", type: "text" }, { name: "Notes", label: "Notes", type: "textarea" }]} />
      </section>
    </main>
  );
}
