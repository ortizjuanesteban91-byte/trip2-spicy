// Tools the booking bot can call. Every price and rule comes from the same data and rules as the website (never invented).
import { allTours, getTour } from "./tours";
import { quote } from "./pricing";
import { money, placeBooking } from "./booking";
import { PUNTA_CANA_HOTELS, MICHES_HOTELS } from "@/data/hotels";

const isMiches = (t) => /miches/i.test(t.breadcrumb || "");
const hotelsFor = (t) => (isMiches(t) ? MICHES_HOTELS : PUNTA_CANA_HOTELS);
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const lines = (sec) => sec.items || sec.paras || (sec.groups || []).flatMap((g) => [`${g.label}:`, ...g.items]) || [];

export const TOOLS = [
  { name: "list_tours", description: "List the tours Trip2 sells (name, slug, category, destination, 'from' price per person). Optional text query filters by name/category/keyword.", input_schema: { type: "object", properties: { query: { type: "string", description: "e.g. 'speedboat', 'saona', 'boats', 'kids'" } } } },
  { name: "get_tour", description: "Full facts for one tour: options with exact prices (per person or per group), times, closed days, minimum people, what is included, FAQ. Use before answering questions about a tour.", input_schema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] } },
  { name: "find_hotel", description: "Match what the guest says to the exact hotel name in the pickup list for that tour. Returns up to 5 matches; if none, the guest can give the hotel or address as typed.", input_schema: { type: "object", properties: { slug: { type: "string" }, query: { type: "string" } }, required: ["slug", "query"] } },
  { name: "quote_booking", description: "Exact server price for a date and quantities. qty is an object mapping the option index (as listed by get_tour, starting at 0) to how many. Always call this before telling the guest a total.", input_schema: { type: "object", properties: { slug: { type: "string" }, date: { type: "string", description: "YYYY-MM-DD" }, qty: { type: "object", additionalProperties: { type: "integer" } } }, required: ["slug", "date", "qty"] } },
  { name: "create_booking", description: "Create the booking AFTER the guest has seen the summary and total and clearly said yes. Returns a secure payment link when card payment is live, otherwise the booking is saved as pay-later.", input_schema: { type: "object", properties: { slug: { type: "string" }, date: { type: "string" }, time: { type: "string", description: "Morning or Afternoon" }, hotel: { type: "string" }, qty: { type: "object", additionalProperties: { type: "integer" } }, name: { type: "string" }, email: { type: "string" }, phone: { type: "string", description: "WhatsApp / phone with country code" }, notes: { type: "string" }, guest_confirmed: { type: "boolean", description: "true only if the guest explicitly confirmed this exact summary and total" } }, required: ["slug", "date", "time", "hotel", "qty", "name", "phone", "guest_confirmed"] } },
];

const brief = (t) => ({ slug: t.slug, name: t.name, category: t.cat, destination: isMiches(t) ? "Miches" : "Punta Cana / Bávaro", from_price_per_person_usd: t.from });

export async function runTool(name, input, ctx) {
  input = input || {};
  if (name === "list_tours") {
    const q = String(input.query || "").toLowerCase().trim();
    let list = await allTours();
    if (q) list = list.filter((t) => `${t.name} ${t.cat} ${t.slug} ${t.keyword || ""} ${t.breadcrumb || ""}`.toLowerCase().includes(q));
    return { count: list.length, tours: list.slice(0, 25).map(brief) };
  }
  const t = await getTour(String(input.slug || ""));
  if (!t) return { error: "unknown tour slug. Call list_tours first." };
  if (name === "get_tour") {
    const sec = (re) => (t.sections || []).filter((s) => re.test(s.h2 || "")).flatMap(lines);
    const faq = (t.sections || []).filter((s) => s.type === "faq").flatMap((s) => s.faq || []).map((f) => `${f.q} ${f.a}`);
    return {
      ...brief(t), url: `/tour/${t.slug}`,
      options: (t.options || []).map((o, i) => ({ index: i, label: o.label, price_usd: o.price, ...(o.priceWknd ? { weekend_price_usd_fri_sat: o.priceWknd } : {}), counts_as_people: o.people || 1 })),
      minimum_2_people: !!t.min2, closed_days: (t.closedDays || []).map((d) => DAYS[d]),
      time_choices: isMiches(t) ? ["Morning (7AM)", "Afternoon (1PM)"] : ["Morning", "Afternoon"],
      highlights: sec(/highlights/i), expect: sec(/expect/i), included: sec(/included/i), pickup: sec(/pickup/i), bring: sec(/bring/i), faq,
      notes: "Hotel pickup round trip is free. The exact pickup time is sent on WhatsApp the night before. Free cancellation up to 24 hours before (private groups 72 hours).",
    };
  }
  if (name === "find_hotel") {
    const q = String(input.query || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 1);
    const list = hotelsFor(t);
    const scored = list.map((h) => { const hl = h.toLowerCase(); return { h, s: q.filter((w) => hl.includes(w)).length }; }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 5);
    return { matches: scored.map((x) => x.h), note: scored.length ? "Ask the guest to confirm which one." : "No match. Accept the hotel/address exactly as the guest typed it." };
  }
  if (name === "quote_booking" || name === "create_booking") {
    const qty = {};
    for (const [k, v] of Object.entries(input.qty || {})) qty[Number(k)] = Number(v);
    const q = quote(t, { date: String(input.date || ""), qty });
    if (!q.ok) return { ok: false, error: { date: "Date must be YYYY-MM-DD", closed: `This tour is closed on ${(t.closedDays || []).map((d) => DAYS[d]).join(", ")}. Offer another date.`, empty: "Pick at least one guest.", min2: "This tour needs at least 2 people." }[q.error] || q.error };
    const today = new Date().toISOString().slice(0, 10);
    if (String(input.date) < today) return { ok: false, error: "That date is in the past." };
    const summary = { tour: t.name, date: input.date, guests: q.people, lines: q.lines.map((l) => `${l.qty} × ${l.label} @ ${money(l.price)} = ${money(l.qty * l.price)}`), total_usd: q.total };
    if (name === "quote_booking") return { ok: true, ...summary };
    if (!input.guest_confirmed) return { ok: false, error: "Not confirmed. Show the summary and total and ask the guest to confirm first." };
    if (!/^\+?[\d\s().-]{7,}$/.test(String(input.phone || "")) && !/^\S+@\S+\.\S+$/.test(String(input.email || ""))) return { ok: false, error: "Need a valid WhatsApp number (with country code) or email." };
    const r = await placeBooking(t, { date: input.date, time: input.time, hotel: input.hotel, qty, name: input.name, email: input.email, phone: input.phone, notes: input.notes }, { origin: ctx.origin, affCode: ctx.affCode, source: "chat bot" });
    if (!r.body.ok) return { ok: false, error: "The booking could not be saved right now. Send the guest to WhatsApp so the team finishes it." };
    return r.body.url
      ? { ok: true, ...summary, pay_now_link: r.body.url, amount_due_now_percent: r.body.pct, next: "Give the guest the pay link. Payment happens on the secure Stripe page, never in the chat." }
      : { ok: true, ...summary, payment: "pay later", next: "Booking saved. The team confirms the exact pickup time on WhatsApp. No payment is taken in the chat." };
  }
  return { error: "unknown tool" };
}
