import Link from "next/link";
import { nav, brand, whatsapp } from "@/data/site";
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-ice/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="font-display text-2xl font-black leading-none text-brand">{brand}</Link>
        <nav className="hidden gap-8 text-[13px] font-bold tracking-wide md:flex" aria-label="Main">
          {nav.map(([l, h]) => <Link key={l} href={h} className="hover:text-brand-hover">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href={whatsapp} className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-brand shadow-sm sm:block">WhatsApp</a>
          <Link href="/tours" className="rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold tracking-wide text-white shadow hover:bg-brand-hover">BOOK NOW</Link>
        </div>
      </div>
    </header>
  );
}
