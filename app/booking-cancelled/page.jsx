import Link from "next/link";
export const metadata = { title: "Payment cancelled | Trip2 Spicy", robots: { index: false, follow: false } };
export default function Page() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="text-3xl font-black text-brand">Payment not completed</h1>
      <p className="mt-3 text-lg leading-8 text-ink/80">Your booking request was saved. Our concierge will contact you on WhatsApp to confirm and arrange payment, or you can book again.</p>
      <Link href="/tours" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-bold text-white">Back to tours</Link>
    </main>
  );
}
