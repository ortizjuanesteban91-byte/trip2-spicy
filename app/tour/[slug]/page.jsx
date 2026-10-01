import { notFound } from "next/navigation";
import Link from "next/link";
import { tours, tourBySlug, grad } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";
import BookingBox from "@/components/BookingBox";
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
  const duration = (t.sections.find((s) => s.type === "list")?.items.find((x) => /hour|day|min/i.test(x)) || "Half Day").replace(/^(about|approx\.?)\s*/i, "");
  const faq = t.sections.find((s) => s.type === "faq");
  const ld = [
    { "@context": "https://schema.org", "@type": "TouristTrip", name: t.h1, description: t.meta, url: `${SITE}/tour/${t.slug}/`, offers: t.from ? { "@type": "Offer", price: String(t.from), priceCurrency: "USD", availability: "https://schema.org/InStock" } : undefined, provider: { "@type": "TravelAgency", name: "Trip2 Punta Cana" } },
    faq && { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ].filter(Boolean);
  return (
    <main>
      {ld.map((o, k) => <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <div className="bg-sky-50/80 py-3"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-ink/60"><p><Link href="/" className="hover:text-brand">Home</Link> › <Link href="/tours" className="hover:text-brand">Excursions</Link> › {t.cat} › {t.name}</p><p className="flex flex-wrap gap-2 font-bold"><span className="rounded-full bg-white px-3 py-1 text-brand">{duration}</span><span className="rounded-full bg-white px-3 py-1 text-amber-700">Free Cancellation up to 24h</span></p></div></div>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <p className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink/70"><span className="rounded-full bg-sky-100 px-3 py-1 uppercase tracking-wide">{t.cat}</span><span>{t.breadcrumb.startsWith("Home › Miches") ? "Miches" : "Punta Cana"}, Dominican Republic</span></p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink sm:text-5xl" data-aos="zoom-out-left">{t.h1}</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-4 sm:grid-rows-2" data-aos="zoom-in">
          <div className={`h-64 rounded-2xl bg-gradient-to-br sm:col-span-2 sm:row-span-2 sm:h-auto ${grad(i)}`} role="img" aria-label={t.alts[0] || t.h1} />
          <div className={`h-32 rounded-2xl bg-gradient-to-br sm:col-span-2 ${grad(i + 1)}`} role="img" aria-label={t.alts[1] || t.h1} />
          <div className={`h-32 rounded-2xl bg-gradient-to-br ${grad(i + 2)}`} /><div className={`h-32 rounded-2xl bg-gradient-to-br ${grad(i + 3)}`} />
        </div>
        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="grid grid-cols-2 gap-5 rounded-3xl border border-sky-100 bg-ice p-5 sm:grid-cols-4" data-aos="zoom-out-right">
              {[["DURATION", duration, "⏱️"], ["GROUP SIZE", "Small groups", "👥"], ["PICKUP", "Resorts", "🚐"], ["LANGUAGE", "Eng & Spa", "🌐"]].map(([k, v, ic]) => <div key={k} className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg">{ic}</span><div><p className="text-[11px] font-extrabold tracking-widest text-ink/50">{k}</p><p className="text-base font-bold">{v}</p></div></div>)}
            </div>
            <h2 className="mb-3 mt-10 text-lg font-extrabold text-ink">Tour Details</h2>
            <div data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
            <Sections sections={t.sections} />
          </div>
          <aside id="book" className="lg:sticky lg:top-24 lg:self-start" data-aos="zoom-in"><BookingBox tour={t} /></aside>
        </div>
      </div>
    </main>
  );
}
