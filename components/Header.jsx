import Link from "next/link";
import { nav } from "@/data/site";
import { getSite } from "@/lib/siteconf";
import { allTours } from "@/lib/tours";
import { catOf, CATS } from "@/lib/content";
import SearchBox from "@/components/SearchBox";
export default async function Header() {
  const { wa: whatsapp } = await getSite();
  const idx = (await allTours()).map((t) => ({ slug: t.slug, name: t.name, title: t.h1, keyword: t.keyword, meta: t.meta, from: t.from, catLabel: (CATS.find(([k]) => k === catOf(t.slug)) || [0, ""])[1] }));
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/60 bg-ice/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3.5 sm:px-5">
        <Link href="/" aria-label="Trip2 Punta Cana home"><img src="/img/logo.webp" alt="Trip2 Punta Cana" width="140" height="52" className="block h-[58px] w-auto" /></Link>
        <nav className="hidden gap-8 text-[13px] font-bold tracking-wide md:flex" aria-label="Main">
          {nav.map(([l, h]) => <Link key={l} href={h} className="hover:text-brand-hover">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <SearchBox tours={idx} />
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded-full bg-[#25D366] px-3 py-2.5 text-xs font-extrabold tracking-wide text-white shadow hover:brightness-95 sm:px-5">WhatsApp</a>
          <Link id="hdr-book" href="/tours" className="inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded-full bg-brand px-3 py-2.5 text-xs font-extrabold tracking-wide text-white shadow hover:bg-brand-hover sm:px-5">BOOK NOW</Link>
        </div>
      </div>
    </header>
  );
}
