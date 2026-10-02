import Link from "next/link";
// Honest brand story. Facts only: 16 years in Dominican tourism, Trip2 since 2017, local team, truth over hype.
export default function Story({ dark = false, full = false }) {
  const t = dark ? "text-white" : "text-ink"; const s = dark ? "text-white/75" : "text-ink/70";
  return (
    <section className={`px-5 py-10 md:py-20 ${dark ? "bg-[#07161b]" : "bg-ice"}`}>
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-extrabold tracking-[.25em] text-[#a97c1f]">WHO IS BEHIND TRIP2</p>
        <h2 className={`mt-2 max-w-3xl text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-5xl ${t}`}>We built this because we have been on the other side of the counter.</h2>
        <div className={`mt-4 grid gap-4 md:mt-6 md:gap-8 md:grid-cols-2 ${s}`}>
          <div className="space-y-3 text-[15px] leading-6 md:space-y-4 md:text-lg md:leading-8">
            <p>For 16 years we have worked in Dominican tourism, from hotel concierge desks to running excursions on the ground. We have stood next to guests who were sold a dream and then handed a crowded bus and a bad lunch.</p>
            <p>We know where people get left behind: the pickup that never comes, the "all inclusive" that is not, the photo that looks nothing like the beach. That frustration is why Trip2 exists.</p>
          </div>
          <div className="space-y-3 text-[15px] leading-6 md:space-y-4 md:text-lg md:leading-8">
            <p>So we put ourselves in your shoes, and we tell it the way it is. Real photos, real timings, what is included and what is not. If a tour is not right for your family, we will say so.</p>
            <p>You are not booking a generic excursion from a website. You are booking with a local team that picks up the phone, knows the people running each trip, and wants you to leave with the Dominican Republic we actually love.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:mt-10 md:gap-4 sm:grid-cols-3">
          {[["Honest by default", "No false expectations. What you read is what you get."], ["Local, not generic", "A real team in Punta Cana, reachable on WhatsApp before and during your trip."], ["Taken care of", "Pickup, timing and questions handled by people who know the island."]].map(([a, b]) => <div key={a} className={`rounded-2xl p-5 ${dark ? "bg-white/10 ring-1 ring-white/15" : "bg-white shadow-sm ring-1 ring-sky-100"}`}><h3 className={`font-black ${dark ? "text-[#dcb14e]" : "text-brand"}`}>{a}</h3><p className={`mt-1 text-sm ${s}`}>{b}</p></div>)}
        </div>
        {!full && <Link href="/about" className="mt-8 inline-block text-sm font-extrabold text-[#a97c1f] underline">Read our story →</Link>}
      </div>
    </section>
  );
}
