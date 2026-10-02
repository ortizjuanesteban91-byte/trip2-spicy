import Story from "@/components/Story";
import Link from "next/link";
export const metadata = { title: "Our Story | Trip2 Punta Cana", description: "A local Punta Cana team with 16 years in Dominican tourism. Honest tours, real photos, no false expectations.", alternates: { canonical: "https://www.trip2puntacana.com/about/" } };
export default function About() {
  return (
    <main>
      <section className="bg-brand px-5 py-16 text-center text-white"><h1 className="text-4xl font-black md:text-5xl">Our Story</h1><p className="mx-auto mt-3 max-w-2xl text-white/85">Honest tours from people who live here.</p></section>
      <Story full />
      <section className="px-5 py-14 text-center"><Link href="/tours" className="rounded-full bg-brand px-8 py-4 text-sm font-extrabold text-white">See our excursions</Link></section>
    </main>
  );
}
