import { tours, catOf, catsOf, CATS } from "@/lib/content";
import { SITE } from "@/lib/site";
import TourGrid from "@/components/TourGrid";
export const metadata = { title: "Punta Cana Tours & Excursions | Trip2", description: "All Trip2 Punta Cana tours and excursions: boats, Saona Island, ATV, buggy, zipline and more. Hotel pickup and free cancellation.", alternates: { canonical: `${SITE}/tours/` } };
export default async function Page({ searchParams }) {
  const { cat, dest } = await searchParams;
  const list = tours.map((t, i) => ({ slug: t.slug, name: t.name, title: t.h1, meta: t.meta, from: t.from, dest: t.breadcrumb.includes("Miches") ? "miches" : "punta-cana", cat: catOf(t.slug), cats: catsOf(t.slug), i }));
  return (
    <main>
      <section className="bg-brand py-16 text-center text-white"><h1 className="text-4xl font-black" data-aos="zoom-in">All Tours</h1></section>
      <div className="mx-auto max-w-6xl px-5 py-10"><TourGrid tours={list} cats={CATS} initialDest={dest === "miches" || dest === "punta-cana" ? dest : "all"} initial={CATS.some(([k]) => k === cat) ? cat : "all"} /></div>
    </main>
  );
}
