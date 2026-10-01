import Link from "next/link";
export const metadata = { title: "Booking received | Trip2 Spicy", robots: { index: false, follow: false } };
export default function Page() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="text-3xl font-black text-brand">Thank you! Payment received</h1>
      <p className="mt-3 text-lg leading-8 text-ink/80">Your booking is confirmed. Our concierge will contact you on WhatsApp to arrange your pickup.</p>
      <Link href="/tours" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-bold text-white">See more tours</Link>
    </main>
  );
}
