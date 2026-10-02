import { gallery } from "@/data/photos";
import { notFound } from "next/navigation";
import Link from "next/link";
import { tours as baseTours, grad, catOf, CATS } from "@/lib/content";
import { allTours, getTour } from "@/lib/tours";
import { SITE } from "@/lib/site";
import { getSite } from "@/lib/siteconf";
import BookingBox from "@/components/BookingBox";
import Sections from "@/components/Sections";
import TourGallery from "@/components/TourGallery";
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
  const ph = t.photos || gallery(t.slug) || [];
  const { wa } = await getSite();
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
        <TourGallery photos={ph} alts={t.alts || []} title={t.h1} grads={[grad(i), grad(i + 1)]} />
        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-5 rounded-3xl border border-sky-100 bg-ice p-5 sm:grid-cols-4" data-aos="zoom-out-right">
              {[["DURATION", String(duration).replace(/^duration:\s*/i, ""), Clock], ["GROUP SIZE", "Small groups", Users], ["RESORT PICKUP", <>Round trip <span className="text-emerald-600">✓</span></>, Car], ["LANGUAGE", "Eng & Spa", Languages]].map(([k, v, Ic]) => <div key={k} className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-brand"><Ic className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-extrabold tracking-widest text-ink/50">{k}</p><p className="text-base font-bold">{v}</p></div></div>)}
            </div>
            <h2 className="mb-3 mt-10 text-lg font-extrabold text-ink">Tour Details</h2>
            <div data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
            <Sections sections={t.sections.slice(0, 1)} />
            <div id="book-m" className="mt-10 scroll-mt-24 lg:hidden"><BookingBox tour={t} wa={wa} /></div>
            <Sections sections={t.sections.slice(1)} />
          </div>
          <aside id="book" className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start" data-aos="zoom-in"><BookingBox tour={t} wa={wa} /></aside>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-100 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <div className="min-w-0 pl-2 leading-tight"><p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">From</p><p className="whitespace-nowrap text-xl font-black text-brand">${Number.isInteger(t.from) ? t.from : t.from.toFixed(2)}<span className="text-xs font-bold text-ink/60"> /person</span></p></div>
          <a href={`${wa}?text=${encodeURIComponent(`Hi Trip2! I'd like info about: ${t.name}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="ml-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-md transition active:scale-95"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a12 12 0 0 0 5.7 1.5h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.6-8.4zM12.1 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.800 1 1-3.700-.2-.4a9.900 9.900 0 0 1-1.500-5.200c0-5.500 4.400-9.900 9.900-9.900 2.600 0 5.100 1 7 2.900a9.800 9.800 0 0 1 2.900 7c0 5.500-4.500 9.900-9.900 9.900zm5.400-7.400c-.3-.1-1.800-.9-2-1-.3-.1-.5-.1-.7.1l-1 1.200c-.2.200-.4.200-.7.100-.3-.1-1.200-.4-2.300-1.400-.9-.8-1.400-1.700-1.600-2-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.300-1 1-1 2.500s1.100 2.900 1.200 3.100c.1.200 2.100 3.200 5.100 4.500.7.300 1.300.5 1.700.6.700.2 1.400.2 1.900.1.600-.1 1.800-.7 2-1.400.3-.7.3-1.300.2-1.400-.1-.1-.3-.2-.6-.3z" /></svg></a>
          <a href="#book-m" className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition active:scale-95"><Zap className="h-4 w-4" />BOOK NOW</a>
        </div>
      </div>
    </main>
  );
}
