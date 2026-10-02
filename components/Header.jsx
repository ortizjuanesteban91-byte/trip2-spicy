import Link from "next/link";
import { nav } from "@/data/site";
import { getSite } from "@/lib/siteconf";
export default async function Header() {
  const { wa: whatsapp } = await getSite();
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-ice/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-5">
        <Link href="/" aria-label="Trip2 Punta Cana home"><img src="/img/logo.webp" alt="Trip2 Punta Cana" width="140" height="52" className="block h-[46px] w-auto" /></Link>
        <nav className="hidden gap-8 text-[13px] font-bold tracking-wide md:flex" aria-label="Main">
          {nav.map(([l, h]) => <Link key={l} href={h} className="hover:text-brand-hover">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-3 py-2.5 text-xs font-extrabold text-white shadow-sm sm:px-4">WhatsApp</a>
          <Link href="/tours" className="rounded-full bg-brand px-4 py-2.5 text-xs sm:px-5 font-extrabold tracking-wide text-white shadow hover:bg-brand-hover">BOOK NOW</Link>
        </div>
      </div>
    </header>
  );
}
