import { email, phone } from "@/data/site";
export const metadata = { title: "Terms & Conditions and Activity Waiver | Trip2 Punta Cana", description: "Booking terms, activity waiver, cancellation and refund policy for Trip2 Punta Cana tours and transfers." };
const H = ({ id, children }) => <h2 id={id} className="mt-9 scroll-mt-24 text-xl font-black text-brand">{children}</h2>;
export default function Terms() {
  return (
    <main>
      <section className="bg-brand px-5 py-14 text-center text-white"><h1 className="text-3xl font-black md:text-5xl">Terms &amp; Conditions and Activity Waiver</h1><p className="mx-auto mt-3 max-w-2xl text-white/85">Please read before you book. Last updated October 2026.</p></section>
      <article className="mx-auto max-w-3xl space-y-3 px-5 py-10 text-[15px] leading-7 text-ink/85">
        <H>1. Who we are: a booking agent</H>
        <p>Trip2 Punta Cana is operated by Trip2 LLC ("Trip2", "we"). Trip2 is a travel booking agent. We sell and arrange excursions, activities and transfers that are provided by independent, licensed third-party operators ("Operators"). Trip2 does not own, operate, manage or control the vehicles, boats, equipment, guides or facilities used on a tour. Your contract for the activity itself is between you and the Operator.</p>
        <H>2. Licensed operators</H>
        <p>We work only with operators that hold the licences and insurance required to run their activity in the Dominican Republic. Operators are independent businesses and are responsible for the safety, conduct and quality of the activity they provide.</p>
        <H>3. Operator responsibility and claims</H>
        <p>To the fullest extent permitted by law, Trip2 is not liable for any injury, illness, death, loss, damage, delay or expense arising from an activity, transfer or service run by an Operator, including accidents during a tour. Any claim relating to an activity must be made directly to the Operator that provided it. On request we will give you the Operator's details and help pass your claim on. Nothing in these terms limits liability that cannot legally be limited.</p>
        <H>4. Activity waiver and assumption of risk</H>
        <p>By booking, each guest (and the booking holder on behalf of everyone in the group, including minors) confirms that:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Activities such as boat and catamaran trips, snorkelling and swimming, ATV, buggy and Polaris rides, zip-lines, horseback riding, parasailing, caves and hikes carry inherent risks, including injury and, in rare cases, death, and the guest accepts these risks voluntarily.</li>
          <li>The guest is in good health and physically fit for the activity, is not pregnant (where the activity is not suitable), and will tell the Operator about any medical condition, injury or disability before starting.</li>
          <li>The guest will follow the instructions and safety briefing of the guides and captains, wear the safety equipment provided, and will not take part under the influence of alcohol or drugs.</li>
          <li>The guest can swim, or will wear a life jacket for all water activities.</li>
          <li>The guest waives and releases Trip2 LLC, its owners, employees and agents from claims arising from the activity, to the extent permitted by law, and will direct any claim to the Operator. The Operator may also ask you to sign its own waiver on the day.</li>
          <li>The Operator may refuse or end participation, without refund, for safety reasons, misconduct, intoxication, or if age, weight or health limits are not met.</li>
        </ul>
        <H>5. Booking and payment</H>
        <p>Prices are in US dollars and are confirmed at booking. Where available, you can book now and pay later, or pay by card on our secure Stripe page. We never see or store your card number. Booking details you give us (names, hotel, dates, number of guests) must be correct. Pickup is within the time frame you choose (morning 7:00 to 8:00 AM, afternoon 12:00 to 2:00 PM); your exact pickup time is sent in your confirmation 1 day before the tour.</p>
        <H id="cancellation">6. Cancellation and refunds</H>
        <p>Free cancellation up to 24 hours before the tour (72 hours for private groups). Later cancellations and no-shows are not refunded. If you are not at your hotel lobby at the pickup time, we cannot guarantee the tour. If we or the Operator cancel, you can reschedule or receive a full refund of what you paid.</p>
        <H>7. Weather and safety</H>
        <p>Tours depend on weather and sea conditions. The Operator may change, delay or cancel for safety. In that case you can reschedule or receive a refund per section 6. We are not responsible for costs outside the booking, such as flights or hotel nights.</p>
        <H>8. Personal belongings</H>
        <p>Keep your valuables with you or leave them at the hotel. Trip2 and the Operators are not responsible for lost, stolen or damaged items, including phones, cameras and jewellery.</p>
        <H>9. Children and groups</H>
        <p>Minors must be accompanied by a parent or guardian, who accepts these terms and the waiver on the child's behalf. Age, height and weight limits set by the Operator apply.</p>
        <H>10. Limit of our liability</H>
        <p>Where Trip2 is found liable for something within our own control (for example a booking error), our liability is limited to the amount you paid Trip2 for that booking.</p>
        <H>11. Governing law</H>
        <p>These terms are governed by the laws of the Dominican Republic. Disputes will first be handled in good faith by contacting us; if unresolved, they go to the competent courts of the Dominican Republic, unless your consumer rights say otherwise.</p>
        <H>12. Contact</H>
        <p>Trip2 LLC · <a className="font-bold text-brand underline" href={`mailto:${email}`}>{email}</a> · {phone}. See also our <a className="font-bold text-brand underline" href="/privacy">Privacy Policy</a>.</p>
      </article>
    </main>
  );
}
