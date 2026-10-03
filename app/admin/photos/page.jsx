import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { allTours } from "@/lib/tours";
import { getSitePhotos, DEFAULT_HERO } from "@/lib/sitephotos";
import { photo } from "@/data/photos";
import { categories } from "@/data/site";
import PhotoManager from "@/components/PhotoManager";
export const dynamic = "force-dynamic";
export const metadata = { title: "Photos | Admin", robots: { index: false, follow: false } };
const CATPIC = { water: "saona-island", adventure: "atv-punta-cana", family: "dolphin-explorer", eco: "los-haitises", culture: "santo-domingo", nightlife: "coco-bongo", miches: "atv-miches" };
const CATURL = { miches: "https://res.cloudinary.com/o3hobtr4/image/upload/f_auto,q_auto,w_900,h_700,c_fill/a" };
export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "tours")) redirect(firstArea(session));
  const [ph, tours] = [await getSitePhotos(true), await allTours()];
  const cards = tours.map((t) => ({ key: t.slug, name: t.name, def: photo(t.slug) || "", cur: ph.cards[t.slug] || "" }));
  const cats = categories.map(([name, , , k]) => ({ key: k, name, def: CATURL[k] || photo(CATPIC[k]) || "", cur: ph.cats[k] || "" }));
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-2xl font-bold">Website photos</h1>
      <p className="mt-1 text-sm text-[#667085]">Header photos (in order), the photo on each tour card, and the photo on each category card. Changes show on the site within a minute.</p>
      <PhotoManager initialHero={ph.customHero ? ph.hero : []} defaultHero={DEFAULT_HERO} cards={cards} cats={cats} />
    </main>
  );
}
