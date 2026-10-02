import TransferBox from "@/components/TransferBox";
import { getSite } from "@/lib/siteconf";
export const metadata = {
  title: "Punta Cana Airport Transfer | Private Pickup to Your Hotel | Trip2",
  description: "Private Punta Cana airport (PUJ) transfers to Bávaro, Cap Cana, Uvero Alto and any hotel. Book in 3 easy steps. Meet & greet, flight tracking, SUV to bus.",
  alternates: { canonical: "https://www.trip2puntacana.com/punta-cana-airport-transfer/" },
};
const faq = [["Do you track my flight?", "Yes. Add your flight number and your driver adjusts to delays at no extra cost."], ["Where will my driver meet me?", "Right outside the arrivals hall with a sign with your name. We send exact details on WhatsApp."], ["How long is the ride to my hotel?", "Most Bávaro and Cap Cana hotels are 20–40 minutes from PUJ. Uvero Alto and Macao are about 40–60 minutes."], ["Can I book a return trip?", "Yes. Choose Round trip in step 1 and add your return date and time."], ["What if my group is large?", "We have vans, mini buses and buses for groups up to 59 guests."]];
export default async function Page() {
  const { wa } = await getSite();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([{ "@context": "https://schema.org", "@type": "Service", name: "Punta Cana Airport Transfer", serviceType: "Airport transfer", areaServed: ["Punta Cana", "Bávaro", "Cap Cana", "Uvero Alto"], provider: { "@type": "TravelAgency", name: "Trip2 Punta Cana" } }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }]) }} />
      <section className="bg-gradient-to-b from-sky-100 to-ice px-5 py-12">
        <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-brand/70">TRANSPORTATION</p><h1 className="mt-1 text-4xl font-black leading-tight text-brand">Punta Cana Airport Transfer</h1>
            <p className="mt-3 text-lg text-[#475467]">Book your private ride in 3 easy steps. Your driver is waiting when you land.</p>
            <ul className="mt-5 grid gap-2 font-bold text-[#344054]"><li>✓ Meet & greet at arrivals</li><li>✓ Flight tracking, no extra cost if delayed</li><li>✓ Private SUV, van, mini bus or bus</li><li>✓ Bávaro, Cap Cana, Uvero Alto and any address</li></ul>
          </div>
          <TransferBox wa={wa} />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-5 text-center text-2xl font-black text-brand">Choose your ride</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Private SUV", "1–5 guests · 5 bags", "Couples, small families"], ["Private Van", "6–10 guests · 10 bags", "Families and friends"], ["Mini Bus", "11–20 guests", "Weddings and groups"], ["Bus", "21–59 guests", "Big events and teams"]].map(([n, a, b]) => <div key={n} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-sky-100"><p className="text-3xl">🚐</p><h3 className="mt-2 font-black text-brand">{n}</h3><p className="text-sm font-bold text-ink/80">{a}</p><p className="text-xs text-ink/60">{b}</p></div>)}</div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <h2 className="mb-4 text-2xl font-black text-brand">Airport transfer questions</h2>
        {faq.map(([q, a]) => <details key={q} className="mb-2 rounded-xl bg-white p-4 shadow-sm"><summary className="cursor-pointer font-extrabold">{q}</summary><p className="mt-2 text-[#667085]">{a}</p></details>)}
      </section>
    </main>
  );
}
