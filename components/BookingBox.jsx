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
export default function BookingBox({ tour, wa }) {
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
    else if (!lines.length) { msg = "Please choose how many guests."; el = form.querySelector("select[aria-label]"); }
    else if (tooFew) { msg = "Minimum 2 people on this tour."; el = form.querySelector("select[aria-label]"); }
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
      const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tour: tour.slug, date: f.date, time: f.time, hotel: f.hotel === "Other" ? f.hotelOther : f.hotel, qty: q, name: `${f.first} ${f.last}`.trim(), email: f.email, phone: f.phone, notes: f.notes, website: f.website }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) { window.location.href = j.url; return; }
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="rounded-2xl bg-white p-6 font-bold text-brand shadow">Thank you! Your request is in. Our concierge will confirm your pickup on WhatsApp. You pay later.</p>;
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
          <div className={opts.length > 1 ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
            {opts.map((o, i) => (
              <div key={i} className={field + (opts.length > 1 && opts.length % 2 === 1 && i === opts.length - 1 ? " col-span-2" : "")}><Ic><Users className="h-5 w-5" /></Ic>
                <select value={q[i] || 0} onChange={(e) => setQ((s) => ({ ...s, [i]: Number(e.target.value) }))} className={sel + " text-sm"} aria-label={o.label}>
                  <option value={0}>{o.label.replace(/\s*\(.*$/, "").replace(/,.*$/, "")}</option>
                  {Array.from({ length: px(o) === 0 ? 5 : 20 }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n} × {o.label.replace(/\s*\(.*$/, "").replace(/,.*$/, "")} · {money(px(o))}</option>)}
                </select><Chev /></div>
            ))}
          </div>
          <div className={field}><Ic><Sun className="h-5 w-5" /></Ic><select name="time" required defaultValue="" className={sel}><option value="" disabled>Time of Day*</option><option>{miches ? "Morning (7AM)" : "Morning"}</option><option>{miches ? "Afternoon (1PM)" : "Afternoon"}</option></select><Chev /></div>
          <div className={field}><Ic><BedDouble className="h-5 w-5" /></Ic><select name="hotel" required value={hotel} onChange={(e) => setHotel(e.target.value)} className={sel}><option value="" disabled>Hotels*</option>
            {(miches ? MICHES : PC).map((h) => <option key={h}>{h}</option>)}
            <option>Other</option></select><Chev /></div>
          {hotel === "Other" && <input name="hotelOther" required placeholder="Hotel / address *" className={plain} />}
          <div className="grid grid-cols-2 gap-3"><input name="first" required placeholder="First name *" className={plain} /><input name="last" required placeholder="Last name *" className={plain} /></div>
          <input name="email" type="email" required placeholder="Email *" className={plain} />
          <input name="phone" required placeholder="Phone / WhatsApp *" className={plain} />
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
        <p className="mt-3 px-1 text-xs text-ink/60">"From" prices are per person, based on the Double. You pay the Single or Double you select.</p>
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
