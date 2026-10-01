import { notFound } from "next/navigation";
import { tours, whatsapp } from "@/data/site";
export function generateStaticParams() { return tours.map((t) => ({ slug: t.slug })); }
export default async function Tour({ params }) {
  const { slug } = await params;
  const t = tours.find((x) => x.slug === slug);
  if (!t) notFound();
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <div className="h-72 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-700" />
      <h1 className="mt-6 text-3xl font-black text-brand">{t.title}</h1>
      <p className="mt-2 text-ink/70">Half Day · Verified Guide · ★ 4.9 (100+)</p>
      <p className="mt-4 text-2xl font-black">From {t.price} <span className="text-sm font-normal">/ person</span></p>
      <a href={whatsapp} className="mt-6 inline-block rounded-full bg-brand px-7 py-3 text-xs font-extrabold text-white">BOOK ON WHATSAPP</a>
    </main>
  );
}
