import ChatOpen from "@/components/ChatOpen";
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
// Tours using the "highlights first, booking next, full description after" layout (testing on one tour first).
const LEAN = new Set(["saona-island"]);
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
  const lean = t.sections[0]?.type === "list";
  const top = lean ? t.sections[0].items.filter((x) => !/^(duration|pickup)/i.test(x)).slice(0, 4).map((x) => (/free cancellation/i.test(x) ? "Reserve now, pay later" : x)) : [];
  const ld = [t.schema]; // JSON-LD copied from the zip SEO Settings (TouristTrip + BreadcrumbList + FAQPage)
  return (
    <main>
      {ld.map((o, k) => <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />)}
      <div className="bg-sky-50/80 py-3"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-ink/60"><p><Link href="/" className="hover:text-brand">Home</Link> › <Link href="/tours" className="hover:text-brand">Excursions</Link> › {catName} › {t.name}</p><p className="flex flex-wrap gap-2 font-bold"><span className="rounded-full bg-white px-3 py-1 text-brand">{duration}</span><span className="rounded-full bg-white px-3 py-1 text-amber-700">Free Cancellation up to 24h</span></p></div></div>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <p className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink/70"><span className="rounded-full bg-sky-100 px-3 py-1 uppercase tracking-wide">{catName}</span><span>{t.breadcrumb.startsWith("Home › Miches") ? "Miches" : "Punta Cana"}, Dominican Republic</span></p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink sm:text-5xl" data-aos="zoom-out-left">{t.h1}</h1>
        <a href="#book" className="mt-5 hidden lg:inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-brand-hover"><Zap className="h-4 w-4" />BOOK NOW</a>
        <TourGallery photos={ph} alts={t.alts || []} title={t.h1} grads={[grad(i), grad(i + 1)]} />
        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-5 rounded-3xl border border-sky-100 bg-ice p-5 sm:grid-cols-4" data-aos="zoom-out-right">
              {[["DURATION", String(duration).replace(/^duration:\s*/i, ""), Clock], ["GROUP SIZE", "Small groups", Users], ["RESORT PICKUP", <>Round trip <span className="text-emerald-600">✓</span></>, Car], ["LANGUAGE", "Eng & Spa", Languages]].map(([k, v, Ic]) => <div key={k} className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-brand"><Ic className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-extrabold tracking-widest text-ink/50">{k}</p><p className="text-base font-bold">{v}</p></div></div>)}
            </div>
            {lean ? (
              <>
                <ul className="mt-6 grid gap-2.5 rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:grid-cols-2">
                  {top.map((x) => <li key={x} className="flex items-start gap-3 text-[15px] font-bold text-ink"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] text-white">✓</span>{x}</li>)}
                </ul>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-ink/60"><span>🔒 Secure online booking</span><span>💬 Our chat guides you step by step, quick replies</span></p>
                <div id="book-m" className="mt-8 scroll-mt-24 lg:hidden"><BookingBox tour={t} wa={wa} /></div>
                <h2 className="mb-3 mt-12 text-lg font-extrabold text-ink">Tour Details</h2>
                <div data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
                <Sections sections={t.sections.slice(1)} />
              </>
            ) : (
              <>
                <h2 className="mb-3 mt-10 text-lg font-extrabold text-ink">Tour Details</h2>
                <div data-aos="zoom-out-left">{t.intro.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}</div>
                <Sections sections={t.sections.slice(0, 1)} />
                <div id="book-m" className="mt-10 scroll-mt-24 lg:hidden"><BookingBox tour={t} wa={wa} /></div>
                <Sections sections={t.sections.slice(1)} />
              </>
            )}
          </div>
          <aside id="book" className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start" data-aos="zoom-in"><BookingBox tour={t} wa={wa} /></aside>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-100 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <div className="min-w-0 pl-2 leading-tight"><p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">From</p><p className="whitespace-nowrap text-xl font-black text-brand">${Number.isInteger(t.from) ? t.from : t.from.toFixed(2)}<span className="text-xs font-bold text-ink/60"> /person</span></p></div>
          <div className="ml-auto flex items-center gap-2"><ChatOpen /><a href="#book-m" className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition active:scale-95"><Zap className="h-3.5 w-3.5" />BOOK NOW</a></div>
        </div>
      </div>
    <style>{"@media(max-width:1023px){#hdr-book{display:none!important}}"}</style>
    </main>
  );
}
