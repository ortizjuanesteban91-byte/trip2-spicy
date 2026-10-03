import { notFound } from "next/navigation";
import { tours, catOf, catsOf, CATS } from "@/lib/content";
import { allTours } from "@/lib/tours";
import { SITE } from "@/lib/site";
import TourGrid from "@/components/TourGrid";
import { getSitePhotos } from "@/lib/sitephotos";

const CATPAGES = {
  "water-adventures": ["water", "Water Adventures in Punta Cana", "Saona Island, catamaran and party boats, speedboats, parasailing, snorkeling and deep sea fishing. Hotel pickup and free cancellation."],
  "adventure-safari": ["adventure", "Adventure & Safari Tours in Punta Cana", "ATV, buggy and Polaris rides, ziplines, horseback riding and Montaña Redonda adventures."],
  "family-experiences": ["family", "Family-Friendly Excursions in Punta Cana", "Dolphin encounters, Monkey Land, buggy and zipline combos and fun days out for all ages."],
  "eco-nature": ["eco", "Eco & Nature Tours in Punta Cana", "Los Haitises caves and mangroves, whale watching, El Limón waterfall and Cayo Levantado."],
  "culture-city": ["culture", "Culture & City Tours in Punta Cana", "Santo Domingo colonial zone and Higüey city tours with local guides."],
  "shows-nightlife": ["nightlife", "Shows & Nightlife in Punta Cana", "Coco Bongo Punta Cana tickets with the live show, open bar and hotel transport."],
  "things-to-do-in-miches": ["miches", "Things to Do in Miches", "ATV trails, horseback rides and Montaña Redonda swings on the wild Emerald Coast. Miches hotel pickup only."],
};
const find = (slug) => CATPAGES[slug];
export function generateStaticParams() { return Object.keys(CATPAGES).map((cat) => ({ cat })); }
export async function generateMetadata({ params }) {
  const { cat } = await params; const c = find(cat); if (!c) return {};
  return { title: `${c[1]} | Trip2`, description: c[2], alternates: { canonical: `${SITE}/tours/${cat}/` } };
}
export default async function Page({ params }) {
  if ((await params).cat === "things-to-do-in-miches") redirect("/m"); // one Miches hub only
  const { cat } = await params; const c = find(cat); if (!c) notFound();
  const list = (await allTours()).map((t) => ({ slug: t.slug, name: t.name, title: t.h1, meta: t.meta, from: t.from, dest: t.breadcrumb.includes("Miches") ? "miches" : "punta-cana", cat: catOf(t.slug), cats: catsOf(t.slug), i: tours.findIndex((x) => x.slug === t.slug) }));
  return (
    <main>
      <section className="bg-brand px-5 py-16 text-center text-white"><h1 className="text-4xl font-black" data-aos="zoom-in">{c[1]}</h1><p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">{c[2]}</p></section>
      <div className="mx-auto max-w-6xl px-5 py-10"><TourGrid ov={(await getSitePhotos()).cards} tours={list} cats={CATS} initialDest="all" initial={c[0]} /></div>
    </main>
  );
}
