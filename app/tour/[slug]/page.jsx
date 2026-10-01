import { notFound } from "next/navigation";
import Link from "next/link";
import { tours as baseTours, grad, catOf, CATS } from "@/lib/content";
import { allTours, getTour } from "@/lib/tours";
import { SITE, whatsappLink } from "@/lib/site";
import BookingBox from "@/components/BookingBox";
import Sections from "@/components/Sections";
import { Clock, Users, Car, Languages } from "@/components/Icon";
import { Zap } from "lucide-react";
export const revalidate = 60;
export function generateStaticParams() { return baseTours.map((t) => ({ slug: t.slug })); }
export async function generateMetadata({ params }) {
  const t = await getTour((await params).slug);
  if (!t) return {};
  const url = t.canonical || `${SITE}/tour/${t.slug}/`;
  return { title: t.metaTitle, description: t.meta, alternates: { canonical: url }, openGraph: { title: t.metaTitle, description: t.meta, url } };
}
export default async function Tour({ params }) {
  const t = await getTour((await params).slug);
  if (!t) notFound();
  const i = baseTours.findIndex((x) => x.slug === t.slug);
  const ph = t.photos || [];
  const catName = (CATS.find(([k]) => k === catOf(t.slug)) || [0, t.cat])[1];
  const duration = (t.sections.find((s) => s.type === "list")?.items.find((x) => /hour|day|min/i.test(x)) || "Half Day").replace(/^(about|approx\.?)\s*/i, "");
  const ld = [t.schema]; // JSON-LD copied from the zip SEO Settings (TouristTrip + BreadcrumbList + FAQPage)
  return (
    <main>
      {ld.map((o, k) => <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <div className="bg-sky-50/80 py-3"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-ink/60"><p><Link href="/" className="hover:text-brand">Home</Link> › <Link href="/tours" className="hover:text-brand">Excursions</Link> › {catName} › {t.name}</p><p className="flex flex-wrap gap-2 font-bold"><span className="rounded-full bg-white px-3 py-1 text-brand">{duration}</span><span className="rounded-full bg-white px-3 py-1 text-amber-700">Free Cancellation up to 24h</span></p></div></div>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <p className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink/70"><span className="rounded-full bg-sky-100 px-3 py-1 uppercase tracking-wide">{catName}</span><span>{t.breadcrumb.startsWith("Home › Miches") ? "Miches" : "Punta Cana"}, Dominican Republic</span></p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink sm:text-5xl" data-aos="zoom-out-left">{t.h1}</h1>
        <a href="#book" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-brand-hover"><Zap className="h-4 w-4" />BOOK NOW</a>
        <div className="mt-8 grid gap-3 sm:grid-cols-4 sm:grid-rows-2" data-aos="zoom-in">
          {[["h-64 sm:col-span-2 sm:row-span-2 sm:h-auto", 0, t.alts[0] || t.h1], ["h-32 sm:col-span-2", 1, t.alts[1] || t.h1], ["h-32", 2, t.h1], ["h-32", 3, t.h1]].map(([c, k, alt]) => (
            <div key={k} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c} ${grad(i + k)}`} role="img" aria-label={alt}>{ph[k] && <img src={ph[k]} alt={alt} loading={k ? "lazy" : "eager"} className="absolute inset-0 h-full w-full object-cover" />}</div>
          ))}
        </div>
        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-5 rounded-3xl border border-sky-100 bg-ice p-5 sm:grid-cols-4" data-aos="zoom-out-right">
              {[["DURATION", duration, Clock], ["GROUP SIZE", "Small groups", Users], ["PICKUP", "Resorts", Car], ["LANGUAGE", "Eng & Spa", Languages]].map(([k, v, Ic]) => <div key={k} className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-brand"><Ic className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-extrabold tracking-widest text-ink/50">{k}</p><p className="text-base font-bold">{v}</p></div></div>)}
            </div>
            <h2 className="mb-3 mt-10 text-lg font-extrabold text-ink">Tour Details</h2>
            <div data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
            <Sections sections={t.sections.slice(0, 1)} />
            <div id="book-m" className="mt-10 scroll-mt-24 lg:hidden"><BookingBox tour={t} /></div>
            <Sections sections={t.sections.slice(1)} />
          </div>
          <aside id="book" className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start" data-aos="zoom-in"><BookingBox tour={t} /></aside>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-100 bg-white/95 p-3 backdrop-blur lg:hidden"><a href="#book-m" className="flex items-center justify-between rounded-full bg-brand px-6 py-3.5 text-sm font-extrabold text-white"><span>From ${Number.isInteger(t.from) ? t.from : t.from.toFixed(2)} / person</span><span className="inline-flex items-center gap-1"><Zap className="h-4 w-4" />BOOK NOW</span></a></div>
    </main>
  );
}
