import { OG_IMAGE } from "@/lib/site";
import Link from "next/link";
import { allTours } from "@/lib/tours";
import { photo } from "@/data/photos";
import { MICHES_URL, michesLive } from "@/lib/miches";
import { whatsapp } from "@/data/site";

const HOTELS = ["Viva Miches by Wyndham", "Club Med Miches Playa Esmeralda", "Zemi Miches Beach Resort by Hilton", "Dreams Playa Esmeralda", "Secrets Playa Esmeralda", "Marriott Miches Beach Resort"];
const FAQ = [
  ["Where do the Miches tours pick up?", `Round-trip pickup from Miches-area hotels only: ${HOTELS.join(", ")}.`],
  ["What time do the tours leave?", "Most Miches tours leave at 7:00 AM or 1:00 PM from your hotel."],
  ["Which Miches tour should I choose?", "Montaña Redonda is the easy, scenic one (4x4 ride, swings, 360° views). ATV is muddy, fast and fun. Horseback is a calm ride to the beach. The combos put two or three together in one day."],
  ["Can I cancel for free?", "Yes. Free cancellation up to 24 hours before the tour."],
  ["How do I book and pay?", "Book online or in the chat on this page. You can reserve now and pay later, or pay securely by card on Stripe's checkout."],
  ["Do you also run tours from Punta Cana and Bávaro?", "Yes. Trip2 also runs Saona Island, catamaran, Los Haitises and more from Punta Cana hotels. This page is for Miches hotels only."],
];
const TITLE = "Miches Tours & Excursions | ATV, Horseback & Montaña Redonda";
const DESC = "Book Miches tours with hotel pickup: Montaña Redonda swings and 360° views, ATV trails, horseback rides to the beach and combos. Free cancellation. Reserve now, pay later.";
export const metadata = {
  title: TITLE, description: DESC, alternates: { canonical: `${MICHES_URL}/` },
  robots: michesLive ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title: TITLE, description: DESC, url: `${MICHES_URL}/`, type: "website", images: [OG_IMAGE] },
};
const money = (n) => `$${Number.isInteger(n) ? n : Number(n).toFixed(2)}`;

export default async function MichesHome() {
  const list = (await allTours()).filter((t) => (t.breadcrumb || "").includes("Miches"));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TravelAgency", "@id": `${MICHES_URL}/#agency`, name: "Miches Tour by Trip2", url: `${MICHES_URL}/`, telephone: "+18094853099", areaServed: "Miches, El Seibo, Dominican Republic", parentOrganization: { "@type": "TravelAgency", name: "Trip2 Punta Cana" } },
      { "@type": "ItemList", name: "Miches tours", itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${MICHES_URL}/tour/${t.slug}/`, name: t.name })) },
      { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h1 className="sr-only">Miches Tours &amp; Excursions</h1>

      <section id="tours" className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-center text-3xl font-black">Choose your Miches adventure</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ink/70">{list.length} tours, all with round-trip pickup from Miches-area hotels.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Link key={t.slug} href={`/tour/${t.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-sky-100 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-emerald-300 to-teal-700">
                {photo(t.slug) && <img src={photo(t.slug)} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold leading-snug">{t.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink/70">{t.meta}</p>
                <p className="mt-4 flex items-center justify-between"><span className="text-sm font-black text-brand">From {money(t.from)} / person</span><span className="rounded-full bg-brand px-4 py-2 text-xs font-extrabold text-white">View &amp; book</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sky-50 px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black">Why do your day in Miches?</h2>
          <p className="mt-3 text-ink/80">Miches is quiet, green and far from the big resort strips of Punta Cana. These tours take you into the countryside, mountains and beaches that most hotel guests never see, led by local guides who know every trail.</p>
          <h3 className="mt-8 text-xl font-extrabold">Hotel pickup in Miches</h3>
          <p className="mt-2 text-ink/80">Pickup at 7:00 AM or 1:00 PM, from Miches-area hotels only:</p>
          <ul className="mt-3 grid gap-1.5 text-sm font-semibold sm:grid-cols-2">{HOTELS.map((h) => <li key={h}>✓ {h}</li>)}</ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-3xl font-black">Miches tours FAQ</h2>
        <div className="mt-5 divide-y divide-sky-100 rounded-2xl bg-white ring-1 ring-sky-100">
          {FAQ.map(([q, a]) => <details key={q} className="group p-5"><summary className="cursor-pointer font-extrabold">{q}</summary><p className="mt-2 text-sm text-ink/80">{a}</p></details>)}
        </div>
        <p className="mt-8 text-center text-sm text-ink/70">Miches Tour is run by <Link href="/" className="font-bold text-brand underline">Trip2 Punta Cana</Link>. Prefer a person? <a href={whatsapp} target="_blank" rel="noopener" className="font-bold text-brand underline">Chat on WhatsApp</a>.</p>
      </section>
    </main>
  );
}
