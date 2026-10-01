import Link from "next/link";
import { photo, strip, HERO } from "@/data/photos";
import { allTours as getAll } from "@/lib/tours";
export const revalidate = 60;
import { trust, categories, advantages, itinerary, guides } from "@/data/site";
import { getSite } from "@/lib/siteconf";
import Reviews from "@/components/Reviews";
const CATPIC = { water: "saona-island", adventure: "atv-punta-cana", family: "dolphin-explorer", eco: "los-haitises", culture: "santo-domingo", nightlife: "coco-bongo", miches: "atv-miches" };
const CATSLUG = { water: "water-adventures", adventure: "adventure-safari", family: "family-experiences", eco: "eco-nature", culture: "culture-city", nightlife: "shows-nightlife", miches: "things-to-do-in-miches" };
const Eyebrow = ({ children }) => <p data-aos="zoom-in" className="text-center text-[11px] font-extrabold tracking-[.25em] text-[#a97c1f]">{children}</p>;
const H2 = ({ children }) => <><h2 data-aos="zoom-in" className="mt-2 text-center text-3xl font-black tracking-tight text-brand md:text-4xl">{children}</h2><span aria-hidden="true" className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gold" /></>;
const Btn = ({ href, children, ghost }) => <Link href={href} className={`inline-flex items-center rounded-full px-6 py-3 text-xs font-extrabold tracking-wide transition hover:-translate-y-0.5 ${ghost ? "bg-gold/35 text-white ring-1 ring-gold/70 backdrop-blur hover:bg-gold/55" : "bg-brand text-white hover:bg-brand-hover"}`}>{children}</Link>;
export default async function Home() {
  const allTours = await getAll();
  const { wa: whatsapp } = await getSite();
  return (
    <main>
      <section className="relative grid min-h-[78vh] place-items-center bg-gradient-to-b from-teal-700 via-teal-600 to-cyan-500 px-5 py-24 text-center text-white">
        {photo(HERO) && <img src={photo(HERO)} alt="Punta Cana excursions" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/50" />
        <div className="relative max-w-4xl">
          <p className="mx-auto inline-block rounded-full bg-gold/30 px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-white ring-1 ring-gold/70 backdrop-blur">⭐ OFFICIAL PUNTA CANA VIP EXCURSIONS</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">DISCOVER THE BEST OF PUNTA CANA</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">Unforgettable excursions, island adventures, and authentic Dominican experiences — all curated in one place with VIP local care.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Btn href="/tours">EXPLORE EXCURSIONS →</Btn><Btn href="#featured" ghost>BOOK YOUR ADVENTURE</Btn></div>
          <form action="/tours" className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 text-left text-ink shadow-xl sm:flex-row">
            <label className="flex-1 rounded-xl bg-ice px-4 py-2"><span className="block text-[10px] font-extrabold tracking-widest text-[#a97c1f]">FIND YOUR TOUR</span><input name="q" placeholder="Search tours, islands, adventures" className="w-full bg-transparent py-1 text-sm outline-none" /></label>
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
              <div className="relative h-52 overflow-hidden"><div data-aos="zoom-out-right" className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-700" />{strip(t.slug) ? <div data-aos="zoom-out-right" className="absolute inset-0 flex gap-0.5">{strip(t.slug).map((u, k) => <img key={k} src={u} alt={k ? "" : t.name} loading="lazy" className="h-full min-w-0 flex-1 object-cover" />)}</div> : photo(t.slug) && <img data-aos="zoom-out-right" src={photo(t.slug)} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}<span className="absolute left-3 top-3 z-10 pointer-events-none rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold">FEATURED</span></div>
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
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-teal-800 to-cyan-600 px-5 py-24 text-white md:py-32">
        {photo("saona-island") && <img src={photo("saona-island")} alt="Saona Island" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#021f24]/90 via-[#05444c]/60 to-[#0b5f66]/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#021f24]/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div data-aos="fade-right">
            <p className="inline-block -rotate-2 rounded-full bg-gold px-4 py-1.5 text-[11px] font-black tracking-[.2em] text-[#10222b] shadow-lg">★ THE #1 MUST-DO EXCURSION</p>
            <p className="mt-6 text-2xl font-extrabold tracking-[.18em] text-cyan-100 md:text-3xl">ESCAPE TO</p>
            <h2 className="bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-6xl font-black leading-[.88] tracking-tighter text-transparent drop-shadow-sm sm:text-7xl md:text-8xl">SAONA<br />ISLAND</h2>
            <p className="mt-5 text-xl font-bold text-cyan-50">Turquoise water. White-sand beaches. Caribbean paradise.</p>
            <p className="mt-3 max-w-xl text-white/85">Glide across calm waters on a high-speed catamaran, swim in chest-deep natural pools beside giant starfish, and unwind under leaning coconut palms.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/tour/saona-island" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-black tracking-wide text-[#10222b] shadow-xl transition hover:-translate-y-0.5 hover:brightness-105">BOOK SAONA ISLAND <span aria-hidden="true">→</span></Link>
              <Link href="/tours/water-adventures" className="inline-flex rounded-full bg-white/10 px-7 py-4 text-sm font-extrabold ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20">ALL WATER TOURS</Link>
              {allTours.find((t) => t.slug === "saona-island") && <p className="ml-1 text-sm font-bold text-cyan-100">From <b className="text-3xl font-black text-white">${allTours.find((t) => t.slug === "saona-island").from}</b> / person</p>}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4" data-aos="fade-left">
            {[["🏝️", "Natural Sandbar Swimming Pools"], ["🍹", "Open Bar & Dominican Buffet"], ["⭐", "Starfish Sanctuary Visits"], ["🚐", "Direct Hotel Round-Trip Transport"]].map(([e, x], i) => (
              <li key={x} className={`rounded-3xl bg-white/12 p-5 shadow-xl ring-1 ring-white/30 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/20 ${i % 2 ? "translate-y-4" : ""}`}><span className="text-4xl" aria-hidden="true">{e}</span><p className="mt-3 text-base font-extrabold leading-snug">{x}</p></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="relative isolate overflow-hidden bg-[#04262b] px-5 py-20 text-white md:py-28">
        <p aria-hidden="true" className="pointer-events-none absolute -right-4 top-6 -z-10 select-none text-[34vw] font-black leading-none tracking-tighter md:text-[20rem]" style={{ color: "transparent", WebkitTextStroke: "2px rgba(125,211,199,.22)" }}>MICHES</p>
        <div className="absolute -left-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1fr_1.05fr]">
          <div className="relative" data-aos="fade-right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-300 to-green-800 shadow-2xl ring-1 ring-white/20 md:rotate-[-2deg]">
              {photo("montana-redonda-atv-miches") && <img src={photo("montana-redonda-atv-miches")} alt="ATV adventure in Miches" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-xs font-black tracking-[.2em] text-white/90">MONTAÑA REDONDA · EMERALD COAST</p>
            </div>
            <span className="absolute -right-2 -top-4 rotate-6 rounded-full bg-gold px-5 py-2 text-xs font-black tracking-[.15em] text-[#10222b] shadow-xl">OFF THE BEATEN PATH</span>
          </div>
          <div data-aos="fade-left">
            <p className="text-[11px] font-extrabold tracking-[.3em] text-emerald-300">UNSPOILED DOMINICAN REPUBLIC</p>
            <h2 className="mt-2 text-5xl font-black leading-[.9] tracking-tighter sm:text-6xl md:text-7xl">DISCOVER<br /><span className="bg-gradient-to-r from-emerald-300 to-gold bg-clip-text text-transparent">MICHES</span></h2>
            <p className="mt-5 max-w-xl text-white/80">Leave the resort corridor behind. Virgin beaches, mountaintop swings with 360° views, muddy ATV trails and authentic fishing villages on the wild Emerald Coast.</p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{["Montaña Redonda Swings", "ATV Mountain Trails", "Untouched Emerald Coast", "Laguna Limón Nature", "Private Guided Excursions"].map((x) => <li key={x} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm font-bold ring-1 ring-white/15"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400 text-xs font-black text-[#04262b]">✓</span>{x}</li>)}</ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/tours?dest=miches" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-8 py-4 text-sm font-black tracking-wide text-[#04262b] shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-300">EXPLORE MICHES TOURS <span aria-hidden="true">→</span></Link>
              {allTours.find((t) => t.slug === "atv-miches") && <p className="text-sm font-bold text-emerald-100">From <b className="text-3xl font-black text-white">${allTours.find((t) => t.slug === "atv-miches").from}</b> / person</p>}
            </div>
          </div>
        </div>
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
      <Reviews />
      <section className="bg-gradient-to-r from-teal-800 to-cyan-700 px-5 py-16 text-center text-white"><div data-aos="zoom-in">
        <h2 className="mx-auto max-w-2xl text-3xl font-black md:text-4xl">READY FOR YOUR PUNTA CANA ADVENTURE?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">Lock in your excursions with guaranteed lowest prices, no reservation fees, and real-time WhatsApp coordination.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/tours" className="rounded-full bg-white px-6 py-3 text-xs font-extrabold text-brand">EXPLORE ALL EXCURSIONS</Link><a href={whatsapp} className="rounded-full bg-emerald-500 px-6 py-3 text-xs font-extrabold text-white">CHAT ON WHATSAPP</a></div>
        <p className="mt-6 text-xs font-bold text-sky-100">24h Free Cancellation · Reserve Now & Pay Later · 24/7 Island Concierge</p>
      </div></section>
    </main>
  );
}
