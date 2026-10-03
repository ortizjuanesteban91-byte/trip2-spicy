"use client";
import { useState } from "react";
import SecurePay, { TrustTop } from "./SecurePay";
import { PUNTA_CANA_HOTELS as PC, MICHES_HOTELS as MICHES } from "@/data/hotels";
import { CalendarDays, Users, Sun, BedDouble, Zap, MessageCircle, ShieldCheck, ChevronDown } from "lucide-react";
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const field = "relative";
const sel = "w-full appearance-none rounded-2xl border border-sky-200 bg-sky-50/70 py-4 pl-12 pr-10 text-[15px] text-ink";
const Ic = ({ children }) => <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand">{children}</span>;
const Chev = () => <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />;
function Inner({ tour, wa }) {
  const [q, setQ] = useState({});
  const [date, setDate] = useState("");
  const [hotel, setHotel] = useState("");
  const [state, setState] = useState("idle");
  const [valid, setValid] = useState(false), [shake, setShake] = useState(0), [hint, setHint] = useState("");
  const check = (f) => setValid(f.checkValidity());
  const miches = tour.breadcrumb.includes("Miches");
  const opts = tour.options || [];
  const dow = date ? new Date(date + "T12:00:00").getDay() : -1;
  const closed = (tour.closedDays || []).includes(dow);
  const px = (o) => (o.priceWknd && (dow === 5 || dow === 6) ? o.priceWknd : o.price);
  const lines = opts.map((o, i) => ({ ...o, price: px(o), qty: q[i] || 0 })).filter((o) => o.qty > 0);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const people = lines.reduce((a, l) => a + l.qty * l.people, 0);
  const tooFew = tour.min2 && people > 0 && people < 2;
  const today = new Date().toISOString().slice(0, 10);
  const mr = /^(2[1-3]|2[6-9]|3[01])$/.test(tour.num);
  const ready = valid && lines.length > 0 && !tooFew && !closed;
  // Tapping RESERVE NOW before the form is complete: shake the button and jump to what is missing.
  function nudge(e) {
    if (ready || state === "sending") return;
    e.preventDefault();
    const form = e.currentTarget.form;
    setShake((n) => n + 1);
    let el, msg;
    if (closed) { msg = "We are closed that day. Please pick another date."; el = form.elements.date; }
    else if (!form.elements.date.value) { msg = "Please choose your date."; el = form.elements.date; }
    else if (!lines.length) { msg = "Please choose how many guests."; el = form.querySelector("[data-qty]"); }
    else if (tooFew) { msg = "Minimum 2 people on this tour."; el = form.querySelector("[data-qty]"); }
    else { el = form.querySelector(":invalid"); msg = "Please fill: " + (el?.getAttribute("placeholder") || el?.getAttribute("name") || "the highlighted field").replace(/\*|\*$/g, "").trim(); }
    setHint(msg);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el?.focus?.({ preventScroll: true }), 350);
  }
  async function submit(e) {
    e.preventDefault();
    if (!lines.length || tooFew || closed) return;
    setState("sending");
    const f = Object.fromEntries(new FormData(e.target));
    try {
      const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tour: tour.slug, date: f.date, time: f.time, hotel: f.hotel === "Other" ? f.hotelOther : f.hotel, qty: q, name: `${f.first} ${f.last}`.trim(), email: f.email, phone: f.phone, notes: f.notes, terms: f.terms === "yes", website: f.website }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) { window.location.href = j.url; return; }
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="rounded-2xl bg-white p-6 font-bold text-brand shadow">Thank you! Your request is in. Pickup is within your chosen time frame; your exact time (for example 7:15 or 7:45 AM) is sent in your confirmation 1 day before the tour. You pay later.</p>;
  const plain = "w-full rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-4 text-[15px] text-ink";
  return (
    <form onSubmit={submit} onChange={(e) => { check(e.currentTarget); setHint(""); }} onInput={(e) => check(e.currentTarget)} className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-lg">
      <div className="bg-sky-100 p-5">
        <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-extrabold tracking-wider text-amber-900">BEST RATE DIRECT</span><span className="flex items-center gap-1 text-xs font-bold text-ink/60"><ShieldCheck className="h-4 w-4 text-brand" />Official Trip2 Guarantee</span></div>
        <p className="mt-3 text-4xl font-black text-brand">{money(tour.from)} <span className="text-sm font-semibold text-ink/50">Base Price</span></p>
        <TrustTop />
      </div>
      <div className="p-4">
        <div className="grid gap-3 rounded-3xl border border-sky-200 bg-sky-50 p-4">
          <div className={field}><Ic><CalendarDays className="h-5 w-5" /></Ic><input name="date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} onClick={(e) => { try { e.currentTarget.showPicker?.(); } catch {} }} className={sel + " pr-4" + (!date ? " text-transparent [&::-webkit-datetime-edit]:opacity-0" : "")} />{!date && <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[15px] text-ink/50">Select date*</span>}</div>
          {date && <p className={`-mt-1 px-1 text-sm font-extrabold ${closed ? "text-amber-700" : "text-brand"}`}>📅 {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}{closed ? " · closed this day" : ""}</p>}
          <div data-qty className="grid gap-2">
            {opts.map((o, i) => { const n = q[i] || 0, nm = o.label.replace(/\s*\(.*$/, "").replace(/,.*$/, ""), set = (v) => setQ((s) => ({ ...s, [i]: Math.max(0, Math.min(99, v)) }));
              return (
              <div key={i} className={`flex items-center justify-between gap-2 rounded-2xl border bg-white px-3 py-2.5 ${n ? "border-brand ring-1 ring-brand/30" : "border-sky-200"}`}>
                <div className="min-w-0 leading-tight"><p className="truncate text-sm font-extrabold text-ink">{nm}</p><p className="text-xs font-bold text-ink/55">{money(px(o))}</p></div>
                <div className="flex shrink-0 items-center gap-1" aria-label={o.label}>
                  <button type="button" onClick={() => set(n - 1)} disabled={!n} aria-label={`Fewer ${nm}`} className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-xl font-black text-brand disabled:opacity-30">−</button>
                  <input type="number" inputMode="numeric" min={0} max={99} value={n} onChange={(e) => set(parseInt(e.target.value, 10) || 0)} onFocus={(e) => e.target.select()} aria-label={`${nm} quantity`} className="h-10 w-12 rounded-xl border border-sky-200 bg-white text-center text-base font-black text-ink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={() => set(n + 1)} aria-label={`More ${nm}`} className="grid h-10 w-10 place-items-center rounded-full bg-brand text-xl font-black text-white">+</button>
                </div>
              </div>); })}
          </div>
          <div className={field}><Ic><Sun className="h-5 w-5" /></Ic><select name="time" required defaultValue="" className={sel}><option value="" disabled>Time of Day*</option><option>{miches ? "Morning (7AM)" : "Morning pickup · 7:00 – 8:00 AM"}</option><option>{miches ? "Afternoon (1PM)" : "Afternoon pickup · 12:00 – 2:00 PM"}</option></select><Chev /></div>
          {!miches && <p className="-mt-1 px-1 text-xs font-semibold text-ink/55">Pickup is within the time frame above (morning 7:00 – 8:00 AM, afternoon 12:00 – 2:00 PM). Your exact time, for example 7:15 or 7:45 AM, depends on your hotel area and is sent in your confirmation 1 day before the tour.</p>}
          <div className={field}><Ic><BedDouble className="h-5 w-5" /></Ic><select name="hotel" required value={hotel} onChange={(e) => setHotel(e.target.value)} className={sel}><option value="" disabled>Hotels*</option>
            {(miches ? MICHES : PC).map((h) => <option key={h}>{h}</option>)}
            <option>Other</option></select><Chev /></div>
          {hotel === "Other" && <input name="hotelOther" required placeholder="Hotel / address *" className={plain} />}
          <div className="grid grid-cols-2 gap-3"><input name="first" required placeholder="First name *" className={plain} /><input name="last" required placeholder="Last name *" className={plain} /></div>
          <input name="email" type="email" required placeholder="Email *" className={plain} />
          <input name="phone" required placeholder="Phone / WhatsApp *" className={plain} />
          <label className="flex items-start gap-3 rounded-2xl bg-sky-50/70 p-3 text-[13px] leading-snug text-ink/80"><input type="checkbox" name="terms" value="yes" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e7490]" /><span>I agree to the <a href="/terms" target="_blank" className="font-bold text-brand underline">Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" className="font-bold text-brand underline">Privacy Policy</a> *</span></label>
          <textarea name="notes" rows={2} placeholder="Notes" className={plain} />
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <div className="mt-1 border-t border-sky-200 pt-4 text-[15px]">
            {lines.length > 0 ? lines.map((l, i) => <p key={i} className="flex justify-between gap-3 py-1"><span className="text-ink/70">{l.label} × {l.qty}</span><b>{money(l.qty * l.price)}</b></p>) : <p className="flex justify-between py-1"><span className="text-ink/70">Base Fee</span><b>{money(tour.from)}</b></p>}
            <p className="flex justify-between py-1"><span className="text-ink/70">Resort Roundtrip Pickup</span><b className="text-brand">FREE</b></p>
            {mr && <p className="flex justify-between py-1"><span className="text-ink/70">Montaña Redonda Entry &amp; Swings</span><b className="text-brand">FREE</b></p>}
          </div>
          <div className="flex items-end justify-between border-t border-sky-200 pt-4"><b className="text-lg text-brand">Total Amount Due</b><b className="text-3xl text-brand">{money(lines.length ? total : tour.from)}</b></div>
          {closed && <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">Closed on Mondays. Please pick another date.</p>}
          {tooFew && <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">Minimum 2 people on this tour. Add a Double or a second guest.</p>}
        </div>
        <p className="mt-3 px-1 text-xs text-ink/60">Tours are run by independent licensed partner operators; Trip2 books them for you. "From" prices are per person, based on the Double. You pay the Single or Double you select.</p>
        {hint && <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-center text-sm font-extrabold text-amber-800">{hint}</p>}
        <button key={shake} onClick={nudge} disabled={state === "sending"} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-extrabold text-white transition ${shake ? "t2-shake " : ""}${ready ? "bg-emerald-600 shadow-lg ring-4 ring-emerald-300/70 hover:bg-emerald-700" : "bg-brand/60"}`}><Zap className="h-4 w-4" />{state === "sending" ? "SENDING…" : ready ? "RESERVE NOW ✓" : "RESERVE NOW"}</button>
        <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-ink/60"><span aria-hidden="true">🔒</span> Secure checkout · Powered by Stripe</p>
        <a href={`/contact?tour=${tour.slug}`} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-sky-100 py-3 text-sm font-bold text-brand"><MessageCircle className="h-4 w-4" />Enquiry Form</a>
        <a href={`${wa || "https://wa.me/18094853099"}?text=${encodeURIComponent(`Hi, I have a question about: ${tour.name}`)}`} className="mt-2 block text-center text-xs font-bold text-brand underline">or ask on WhatsApp</a>
        {state === "error" && <p className="mt-3 text-sm font-bold text-rose-600">Something went wrong. Please try again or use WhatsApp.</p>}
                <div className="mt-4 border-t border-sky-100 pt-3"><SecurePay /></div>
      </div>
    </form>
  );
}

// Private charters: no online price or payment. Guest sends date, group size and hotel; the team replies with a quote.
function QuoteBox({ tour, wa }) {
  const [date, setDate] = useState(""), [n, setN] = useState(""), [hotel, setHotel] = useState(""), [name, setName] = useState("");
  const max = tour.maxGuests || 70;
  const msg = `Hello Trip2! I'd like a quote for: ${tour.name}.\nDate: ${date || "(to confirm)"}\nGuests: ${n || "(to confirm)"}\nHotel: ${hotel || "(to confirm)"}\nName: ${name || ""}`;
  const href = `${wa}${wa.includes("?") ? "&" : "?"}text=${encodeURIComponent(msg)}`;
  const inp = "w-full rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-3.5 text-[15px] text-ink";
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-sky-100">
      <p className="inline-block rounded-full bg-gold/30 px-3 py-1 text-[11px] font-extrabold tracking-widest text-ink">PRIVATE CHARTER</p>
      <h3 className="mt-3 text-2xl font-black text-brand">Quote on request</h3>
      <p className="mt-1 text-sm text-ink/70">Tell us your date and group size (up to {max} guests). We reply with your boat options and price. Nothing is charged until you accept.</p>
      <div className="mt-4 grid gap-3">
        <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={inp} aria-label="Date" />
        <input type="number" inputMode="numeric" min="1" max={max} value={n} onChange={(e) => setN(e.target.value)} placeholder={`Number of guests (max ${max})`} className={inp} />
        <input value={hotel} onChange={(e) => setHotel(e.target.value)} placeholder="Your hotel" className={inp} />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inp} />
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 text-sm font-extrabold text-white hover:bg-brand-hover"><MessageCircle className="h-4 w-4" />REQUEST MY QUOTE ON WHATSAPP</a>
      <button type="button" onClick={() => window.dispatchEvent(new Event("t2-chat-open"))} className="mt-2.5 w-full rounded-full border-2 border-brand py-3.5 text-sm font-extrabold text-brand">Or ask in the chat</button>
      <p className="mt-3 text-center text-xs text-ink/60">Free cancellation up to 72 hours before for private groups.</p>
    </div>
  );
}
export default function BookingBox(props) { return props.tour.inquiry ? <QuoteBox {...props} /> : <Inner {...props} />; }
