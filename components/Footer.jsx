import Link from "next/link";
import { phone, email, whatsapp } from "@/data/site";
const col = (t, items) => (<div><h4 className="mb-3 text-xs font-extrabold tracking-widest text-sky-200">{t.toUpperCase()}</h4><ul className="space-y-2 text-sm">{items.map(([l, h]) => <li key={l}>{h ? <Link href={h} className="hover:text-white">{l}</Link> : l}</li>)}</ul></div>);
export default function Footer() {
  return (
    <footer className="bg-[#0a2a30] text-sky-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-black text-white">Trip2 Spicy</p>
          <p className="mt-3 text-sm font-bold text-sky-200">Explore. Experience. Remember.</p>
          <p className="mt-2 max-w-xs text-sm leading-6">Handcrafted excursions and VIP transfer experiences in Punta Cana. Curated luxury, licensed local captains, and guaranteed unforgettable memories.</p>
          <p className="mt-4 space-y-1 text-sm"><a className="block hover:text-white" href={whatsapp}>WhatsApp Direct Support</a><a className="block hover:text-white" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a><a className="block hover:text-white" href={`mailto:${email}`}>{email}</a></p>
        </div>
        {col("Explore", [["Home", "/"], ["Tours", "/tours"], ["Travel Tips", "/travel-tips"], ["Blogs", "/blog"]])}
        {col("Customer Support", [["WhatsApp", whatsapp], ["Phone", `tel:${phone.replace(/[^+\d]/g, "")}`], ["Email", `mailto:${email}`], ["Contact Us", "/contact"]])}
        {col("Information", [["Reviews"], ["Cancellation Policy"], ["Refund Policy"], ["Terms of Service"], ["Privacy Policy"]])}
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs">
        <p className="mb-2 font-bold text-sky-200">Stripe · VISA · Mastercard · Apple Pay · Google Pay · PayPal</p>
        <p>Reserve Now — Pay Later Guaranteed</p>
        <p className="mt-2">Copyright © 2026 Trip2 Spicy. All rights reserved.</p>
      </div>
    </footer>
  );
}
