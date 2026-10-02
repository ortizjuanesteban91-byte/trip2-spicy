import Link from "next/link";
import { gallery, photo } from "@/data/photos";
import { allTours } from "@/lib/tours";
import { TrustTop } from "@/components/SecurePay";
import Story from "@/components/Story";
export const metadata = { title: "Design preview | Trip2", robots: { index: false, follow: false } };
const pick = ["saona-island", "catamaran-party-boat", "atv-punta-cana", "los-haitises"];
export default async function NewHome() {
  const tours = (await allTours()).filter((t) => pick.includes(t.slug)).sort((a, b) => pick.indexOf(a.slug) - pick.indexOf(b.slug));
  const hero = (gallery("saona-island", 2000) || [])[0] || photo("saona-island");
  const g = gallery("saona-island", 900) || [];
  return (
    <main className="bg-[#07161b] text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        {hero && <img src={hero} alt="Saona Island, Punta Cana" fetchPriority="high" className="absolute inset-0 h-full w-full scale-105 object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07161b] via-[#07161b]/30 to-black/30" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32">
          <p className="mb-4 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-extrabold tracking-[.2em] backdrop-blur">PUNTA CANA · SINCE 2017</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">Your best day in Punta Cana starts here.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">Island days, jungle rides and private transfers. Pick it, pay securely, and a local team handles the rest.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tours" className="rounded-full bg-[#dcb14e] px-7 py-3.5 text-sm font-extrabold text-[#07161b] shadow-lg transition hover:-translate-y-0.5">Explore excursions</Link>
            <Link href="/airport-transfer" className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-extrabold backdrop-blur transition hover:bg-white/20">Book an airport transfer</Link>
          </div>
          <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3 text-center text-xs font-bold sm:text-sm">
            {[["24h", "Free cancellation"], ["Visa · MC · Amex", "Secure checkout"], ["Hotel pickup", "Round trip included"]].map(([a, b]) => <div key={b} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur"><p className="text-base font-black sm:text-xl">{a}</p><p className="text-white/70">{b}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-[11px] font-extrabold tracking-[.25em] text-[#dcb14e]">MOST BOOKED</p>
        <h2 className="mt-2 max-w-xl text-4xl font-black tracking-tight">Pick your adventure</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tours.map((t, i) => { const src = (gallery(t.slug, 1000) || [])[0] || photo(t.slug); return (
            <Link key={t.slug} href={`/tour/${t.slug}`} className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:h-[28rem]" : "h-80"} h-80`}>
              {src && <img src={src} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div><h3 className="text-2xl font-black md:text-3xl">{t.name}</h3><p className="mt-1 text-sm text-white/75">Hotel pickup included · Free cancellation</p></div>
                <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-[#07161b]">from ${t.from}</span>
              </div>
            </Link>); })}
        </div>
      </section>

      {g.length > 3 && <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{g.slice(1, 5).map((s, i) => <img key={i} src={s} alt="Saona Island excursion" loading="lazy" className={`h-48 w-full rounded-2xl object-cover md:h-64 ${i % 2 ? "md:mt-8" : ""}`} />)}</div>
      </section>}

      <Story dark />

      <section className="bg-gradient-to-br from-[#0b5f66] to-[#07303a] px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-extrabold tracking-[.25em] text-[#dcb14e]">TRANSPORTATION</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Landing in Punta Cana? Your driver is already waiting.</h2>
            <p className="mt-4 text-white/80">Private SUVs, vans and buses from the airport to any hotel. Three easy steps: date, hotel, time.</p>
            <Link href="/airport-transfer" className="mt-6 inline-block rounded-full bg-[#dcb14e] px-7 py-3.5 text-sm font-extrabold text-[#07161b]">Book my transfer</Link>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur"><TrustTop /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="text-3xl font-black md:text-4xl">Not sure what to book?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/75">Chat with our assistant. It knows every tour, answers in seconds and can book it for you.</p>
        <p className="mt-6 text-sm font-bold text-[#dcb14e]">Tap the chat bubble in the corner →</p>
      </section>
    </main>
  );
}
