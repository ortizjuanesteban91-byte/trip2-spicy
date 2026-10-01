import Link from "next/link";
import { getSite } from "@/lib/siteconf";
import { getReviews, GOOGLE_READ, TA_WRITE } from "@/lib/reviews";
const col = (t, items) => (<div><h4 className="mb-3 text-xs font-extrabold tracking-widest text-gold">{t.toUpperCase()}</h4><ul className="space-y-2 text-sm">{items.map(([l, h]) => <li key={l}>{h ? <Link href={h} className="hover:text-white">{l}</Link> : l}</li>)}</ul></div>);
export default async function Footer() {
  const { phone, email, wa: whatsapp } = await getSite();
  const { tripadvisor } = await getReviews();
  return (
    <footer className="bg-[#0a2a30] text-sky-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src="/img/logo-white.webp" alt="Trip2 Punta Cana" width="220" height="82" className="block h-16 w-auto" />
          <p className="mt-3 text-sm font-bold text-sky-200">Explore. Experience. Remember.</p>
          <p className="mt-2 max-w-xs text-sm leading-6">Handcrafted excursions and VIP transfer experiences in Punta Cana. Curated luxury, licensed local captains, and guaranteed unforgettable memories.</p>
          <p className="mt-4 space-y-1 text-sm"><a className="block hover:text-white" href={whatsapp}>WhatsApp Direct Support</a><a className="block hover:text-white" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a><a className="block hover:text-white" href={`mailto:${email}`}>{email}</a></p>
        </div>
        {col("Explore", [["Home", "/"], ["Tours", "/tours"], ["Travel Tips", "/travel-tips"], ["Blogs", "/blog"], ["Affiliates", "/affiliates"]])}
        {col("Customer Support", [["WhatsApp", whatsapp], ["Phone", `tel:${phone.replace(/[^+\d]/g, "")}`], ["Email", `mailto:${email}`], ["Contact Us", "/contact"]])}
        {col("Information", [["Cancellation Policy"], ["Refund Policy"], ["Terms of Service"], ["Privacy Policy"]])}
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs">
        <p className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-sky-100"><span className="text-sky-200">Find us on</span><a href={GOOGLE_READ} target="_blank" rel="noopener noreferrer" className="hover:text-white">Google ★</a><a href={tripadvisor || TA_WRITE} target="_blank" rel="noopener noreferrer" className="hover:text-white">{tripadvisor ? "TripAdvisor ↗" : "Review us on TripAdvisor ↗"}</a></p>
        <p className="mb-2 font-bold text-sky-200">Stripe · VISA · Mastercard · Apple Pay · Google Pay · PayPal</p>
        <p>Reserve Now — Pay Later Guaranteed</p>
        <p className="mt-2">Copyright © 2026 Trip2 Punta Cana. All rights reserved.</p>
      </div>
    </footer>
  );
}
