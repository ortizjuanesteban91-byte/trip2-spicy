import Link from "next/link";
import { photo } from "@/data/photos";
import { allTours as getAll } from "@/lib/tours";
export const revalidate = 60;
import { trust, categories, advantages, reviews, itinerary, guides, whatsapp } from "@/data/site";
const CATPIC = { water: "saona-island", adventure: "atv-punta-cana", family: "dolphin-explorer", eco: "los-haitises", culture: "santo-domingo", nightlife: "coco-bongo", miches: "atv-miches" };
const CATSLUG = { water: "water-adventures", adventure: "adventure-safari", family: "family-experiences", eco: "eco-nature", culture: "culture-city", nightlife: "shows-nightlife", miches: "things-to-do-in-miches" };
const Eyebrow = ({ children }) => <p data-aos="zoom-in" className="text-center text-[11px] font-extrabold tracking-[.25em] text-brand/70">{children}</p>;
const H2 = ({ children }) => <h2 data-aos="zoom-in" className="mt-2 text-center text-3xl font-black tracking-tight text-brand md:text-4xl">{children}</h2>;
const Btn = ({ href, children, ghost }) => <Link href={href} className={`inline-flex items-center rounded-full px-6 py-3 text-xs font-extrabold tracking-wide transition hover:-translate-y-0.5 ${ghost ? "bg-white/20 text-white backdrop-blur hover:bg-white/30" : "bg-brand text-white hover:bg-brand-hover"}`}>{children}</Link>;
export default async function Home() {
  const allTours = await getAll();
  return (
    <main>
      <section className="relative grid min-h-[78vh] place-items-center bg-gradient-to-b from-teal-700 via-teal-600 to-cyan-500 px-5 py-24 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
        <div className="relative max-w-4xl">
          <p className="mx-auto inline-block rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-extrabold tracking-widest backdrop-blur">⭐ OFFICIAL PUNTA CANA VIP EXCURSIONS</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">DISCOVER THE BEST OF PUNTA CANA</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">Unforgettable excursions, island adventures, and authentic Dominican experiences — all curated in one place with VIP local care.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Btn href="/tours">EXPLORE EXCURSIONS →</Btn><Btn href="#featured" ghost>BOOK YOUR ADVENTURE</Btn></div>
          <form action="/tours" className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 text-left text-ink shadow-xl sm:flex-row">
            <label className="flex-1 rounded-xl bg-ice px-4 py-2"><span className="block text-[10px] font-extrabold tracking-widest text-brand/70">TOUR</span><input name="q" placeholder="Enter destination" className="w-full bg-transparent py-1 text-sm outline-none" /></label>
            <button className="rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover">Find Tours</button>
          </form>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map(([t, d], i) => <div key={t} data-aos="zoom-in" data-aos-delay={i * 100} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"><h3 className="text-base font-extrabold text-brand">{t}</h3><p className="mt-1 text-sm leading-6 text-ink/70">{d}</p></div>)}
      </section>
      <section id="excursions" className="bg-ice px-5 py-16">
        <Eyebrow>CURATED CATEGORIES</Eyebrow><H2>FIND YOUR PERFECT ADVENTURE</H2>
        <p data-aos="zoom-in" className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink/70">From tranquil island shallows and turquoise reefs to adrenaline-packed mountain tracks, select the experience custom-crafted for your traveling party.</p>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(([t, d, g, k], i) => <Link key={t} href={`/tours/${CATSLUG[k]}`} className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow transition hover:-translate-y-1"><div data-aos="zoom-out-right" className={`absolute inset-0 bg-gradient-to-br ${g}`} />{photo(CATPIC[k]) && <img data-aos="zoom-out-right" src={photo(CATPIC[k])} alt={t} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" /><div className="relative" data-aos="zoom-out-left"><h3 className="text-xl font-black">{t}</h3><p className="mt-1 text-sm text-white/85">{d}</p></div></Link>)}
        </div>
      </section>
      <section id="featured" className="mx-auto max-w-7xl px-5 py-16">
        <Eyebrow>GUARANTEED BEST RATES</Eyebrow><H2>PUNTA CANA'S MOST POPULAR EXPERIENCES</H2>
        <p data-aos="zoom-in" className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink/70">Handpicked top-rated excursions with instant mobile vouchers, verified local guides, and 24-hour cancellation freedom.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {["saona-island","atv-punta-cana","catamaran-party-boat"].map((x) => allTours.find((t) => t.slug === x)).filter(Boolean).map((t, i) => (
            <article key={t.slug} className="relative cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-2xl bg-white shadow-md ring-1 ring-sky-100">
              <div className="relative h-52 overflow-hidden"><div data-aos="zoom-out-right" className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-700" />{photo(t.slug) && <img data-aos="zoom-out-right" src={photo(t.slug)} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}<span className="absolute left-3 top-3 z-10 pointer-events-none rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold">FEATURED</span></div>
              <div className="p-5"><div data-aos="zoom-out-left"><p className="text-[10px] font-extrabold tracking-widest text-brand/70">EXCURSION</p><h3 className="mt-1 text-lg font-extrabold leading-snug">{t.name}</h3><p className="mt-2 text-xs text-ink/60">Half Day · Verified Guide</p></div>
                <div className="mt-4 flex items-end justify-between"><p className="text-xs text-ink/60">From<br /><b className="text-2xl text-brand">${Number.isInteger(t.from) ? t.from : t.from.toFixed(2)}</b> / person</p><Link href={`/tour/${t.slug}`} className="rounded-full bg-brand px-5 py-2.5 text-xs after:absolute after:inset-0 after:z-20 after:content-[''] font-extrabold text-white hover:bg-brand-hover">VIEW TOUR</Link></div></div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-ice px-5 py-16">
        <Eyebrow>THE TRIP2 ADVANTAGE</Eyebrow><H2>YOUR PUNTA CANA ADVENTURE STARTS HERE</H2>
        <p data-aos="zoom-in" className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink/70">We make discovering Punta Cana simple, exciting, and stress-free — from choosing your experience to seamless transfers back to your resort.</p>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">{advantages.map(([t, d], i) => <div key={t} data-aos="zoom-in" data-aos-delay={(i % 3) * 120} className="rounded-2xl bg-white p-6 shadow-sm"><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">✓</div><h3 className="font-extrabold text-brand">{t}</h3><p className="mt-1 text-sm leading-6 text-ink/70">{d}</p></div>)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Eyebrow>REAL GUEST SENTIMENT</Eyebrow><H2>WHAT OUR GUESTS SAY</H2>
        <p className="mt-4 text-center text-sm font-bold text-ink/70">4.9 / 5 · Google Reviews • Tripadvisor Certificate of Excellence • Trustpilot · 1,200+ Travelers</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{reviews.map(([q, n, t], i) => <figure key={n} data-aos="zoom-in" data-aos-delay={i * 120} className="rounded-2xl bg-white p-6 shadow ring-1 ring-sky-100"><p className="text-amber-500">★★★★★</p><blockquote className="mt-3 text-sm leading-6 text-ink/80">"{q}"</blockquote><figcaption className="mt-4"><b className="block">{n}</b><span className="text-xs text-ink/60">{t}</span></figcaption></figure>)}</div>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-cyan-600 px-5 py-20 text-white">
        {photo("saona-island") && <img src={photo("saona-island")} alt="Saona Island" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-cyan-800/70" />
        <div className="relative mx-auto max-w-3xl text-center" data-aos="zoom-in">
          <p className="text-[11px] font-extrabold tracking-[.25em] text-sky-100">THE #1 MUST-DO EXCURSION</p>
          <h2 className="mt-2 text-4xl font-black md:text-5xl">ESCAPE TO SAONA ISLAND</h2>
          <h3 className="mt-3 text-xl font-bold text-sky-100">Turquoise water. White-sand beaches. Caribbean paradise.</h3>
          <p className="mt-4 text-white/90">Experience the Dominican Republic’s most celebrated coastal sanctuary. Glide across calm waters on high-speed catamarans, swim in chest-deep natural pools alongside giant cushion starfish, and relax beneath leaning coconut palms on pristine white sands.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-bold">{["Natural Sandbar Swimming Pools", "Open Bar & Dominican Buffet", "Starfish Sanctuary Visits", "Direct Hotel Roundtrip Transport"].map((x) => <li key={x} className="rounded-full bg-white/15 px-4 py-2">{x}</li>)}</ul>
          <div className="mt-8"><Link href="#featured" className="inline-block rounded-full bg-white px-7 py-3 text-xs font-extrabold text-brand">EXPLORE SAONA ISLAND</Link></div>
        </div>
      </section>
      <section className="grid md:grid-cols-2">
        <div className="min-h-72 overflow-hidden"><div className="relative h-full min-h-72"><div data-aos="zoom-out-right" className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-green-800" />{photo("montana-redonda-atv-miches") && <img data-aos="zoom-out-right" src={photo("montana-redonda-atv-miches")} alt="Miches" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}</div></div>
        <div className="px-6 py-14 md:px-14" data-aos="zoom-out-left"><p className="text-[11px] font-extrabold tracking-[.25em] text-brand/70">UNSPOILED DOMINICAN REPUBLIC</p><h3 className="mt-1 text-sm font-bold text-ink/60">Montaña Redonda & Emerald Coast</h3><p className="mt-5 text-[11px] font-extrabold tracking-[.25em] text-brand/70">OFF THE BEATEN PATH</p><h2 className="text-4xl font-black text-brand">DISCOVER MICHES</h2><p className="mt-3 text-sm leading-6 text-ink/75">Go beyond the typical resort corridors and discover the raw ecological beauty, virgin beaches, towering mountaintop swings, and authentic fishing communities of the emerging Miches coastline.</p><ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-brand">{["Montaña Redonda Swings", "ATV Mountain Trails", "Untouched Emerald Coast", "Laguna Limón Nature", "Private Guided Excursions"].map((x) => <li key={x}>✓ {x}</li>)}</ul><div className="mt-6"><Btn href="/tours?dest=miches">EXPLORE MICHES TOURS</Btn></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Eyebrow>ITINERARY INSPIRATION</Eyebrow><H2>ONE DESTINATION. ENDLESS ADVENTURES.</H2>
        <p data-aos="zoom-in" className="mx-auto mt-3 max-w-xl text-center text-sm text-ink/70">Craft your Dominican story across dawn, day, and sunset with balanced, memorable pacing.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{itinerary.map(([time, t, d, cta, g], i) => <article key={t} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-sky-100"><div className="h-48 overflow-hidden"><div data-aos="zoom-out-right" className={`h-full bg-gradient-to-br ${g}`} /></div><div className="p-5" data-aos="zoom-out-left"><p className="text-[11px] font-extrabold tracking-widest text-brand/70">{time}</p><h3 className="mt-1 text-lg font-extrabold">{t}</h3><p className="mt-2 text-sm leading-6 text-ink/70">{d}</p><Link href="/tours" className="mt-3 inline-block text-sm font-bold text-brand">{cta} →</Link></div></article>)}</div>
      </section>
      <section className="bg-ice px-5 py-16">
        <Eyebrow>INSIDER INTELLIGENCE</Eyebrow><H2>PUNTA CANA TRAVEL GUIDE</H2>
        <p data-aos="zoom-in" className="mx-auto mt-3 max-w-xl text-center text-sm text-ink/70">Tips, packing lists, and local recommendations written by resident excursion coordinators.</p>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">{guides.map(([c, m, t, d, g], i) => <article key={t} className="overflow-hidden rounded-2xl bg-white shadow"><div className="h-44 overflow-hidden"><div data-aos="zoom-out-right" className={`h-full bg-gradient-to-br ${g}`} /></div><div className="p-5" data-aos="zoom-out-left"><p className="text-[11px] font-extrabold tracking-widest text-brand/70">{c} • {m}</p><h3 className="mt-1 text-lg font-extrabold leading-snug">{t}</h3><p className="mt-2 text-sm leading-6 text-ink/70">{d}</p><Link href="/blog" className="mt-3 inline-block text-sm font-bold text-brand">Read Article →</Link></div></article>)}</div>
      </section>
      <section className="bg-gradient-to-r from-teal-800 to-cyan-700 px-5 py-16 text-center text-white"><div data-aos="zoom-in">
        <h2 className="mx-auto max-w-2xl text-3xl font-black md:text-4xl">READY FOR YOUR PUNTA CANA ADVENTURE?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">Lock in your excursions with guaranteed lowest prices, no reservation fees, and real-time WhatsApp coordination.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/tours" className="rounded-full bg-white px-6 py-3 text-xs font-extrabold text-brand">EXPLORE ALL EXCURSIONS</Link><a href={whatsapp} className="rounded-full bg-emerald-500 px-6 py-3 text-xs font-extrabold text-white">CHAT ON WHATSAPP</a></div>
        <p className="mt-6 text-xs font-bold text-sky-100">24h Free Cancellation · Reserve Now & Pay Later · 24/7 Island Concierge</p>
      </div></section>
    </main>
  );
}
