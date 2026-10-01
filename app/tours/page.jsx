import Link from "next/link";
import { tours, grad, tourHref } from "@/lib/content";
import { SITE } from "@/lib/site";
export const metadata = { title: "Punta Cana Tours & Excursions | Trip2", description: "All Trip2 Punta Cana tours and excursions: boats, Saona Island, ATV, buggy, zipline and more. Hotel pickup and free cancellation.", alternates: { canonical: `${SITE}/tours/` } };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-center text-4xl font-black text-brand" data-aos="zoom-in">Punta Cana Tours & Excursions</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((t, i) => (
          <article key={t.slug} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-sky-100">
            <div className="h-44 overflow-hidden"><div data-aos="zoom-out-right" className={`h-full bg-gradient-to-br ${grad(i)}`} /></div>
            <div className="p-5" data-aos="zoom-out-left">
              <h2 className="text-lg font-extrabold leading-snug">{t.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70">{t.meta}</p>
              <div className="mt-4 flex items-end justify-between"><p className="text-xs text-ink/60">From<br /><b className="text-2xl text-brand">${t.from}</b> / person</p><Link href={tourHref(t.slug)} className="rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-hover">VIEW TOUR</Link></div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
