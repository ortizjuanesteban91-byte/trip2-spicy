import { tours, catOf, catsOf, CATS } from "@/lib/content";
import { allTours } from "@/lib/tours";
import { SITE } from "@/lib/site";
import TourGrid from "@/components/TourGrid";
import { getSitePhotos } from "@/lib/sitephotos";
export const metadata = { title: "Punta Cana Tours & Excursions | Trip2", description: "All Trip2 Punta Cana tours and excursions: boats, Saona Island, ATV, buggy, zipline and more. Hotel pickup and free cancellation.", alternates: { canonical: `${SITE}/tours/` } };
export default async function Page({ searchParams }) {
  const { cat, dest, q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 80) : "";
  const list = (await allTours()).map((t) => ({ slug: t.slug, name: t.name, title: t.h1, meta: t.meta, from: t.from, dest: t.breadcrumb.includes("Miches") ? "miches" : "punta-cana", cat: catOf(t.slug), cats: catsOf(t.slug), i: tours.findIndex((x) => x.slug === t.slug) }));
  return (
    <main>
      <section className="bg-brand py-16 text-center text-white"><h1 className="text-4xl font-black" data-aos="zoom-in">All Tours</h1></section>
      <div className="mx-auto max-w-6xl px-5 py-10"><TourGrid ov={(await getSitePhotos()).cards} tours={list} cats={CATS} initialQ={query} initialDest={query ? "all" : dest === "miches" || dest === "punta-cana" ? dest : "all"} initial={CATS.some(([k]) => k === cat) ? cat : "all"} /></div>
    </main>
  );
}
