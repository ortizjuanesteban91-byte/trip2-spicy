"use client";
import { useState } from "react";
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export default function BookingBox({ tour }) {
  const [q, setQ] = useState({});
  const [state, setState] = useState("idle");
  const [date, setDateV] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const opts = tour.options || [];
  const lines = opts.map((o, i) => ({ ...o, qty: q[i] || 0 })).filter((o) => o.qty > 0);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const people = lines.reduce((a, l) => a + l.qty * l.people, 0);
  const free = (l) => l.price === 0;
  const tooFew = tour.min2 && people > 0 && people < 2;
  const set = (i, d) => setQ((s) => ({ ...s, [i]: Math.max(0, (s[i] || 0) + d) }));
  async function submit(e) {
    e.preventDefault();
    if (!lines.length || tooFew) return;
    setState("sending");
    const f = Object.fromEntries(new FormData(e.target));
    const { first, last, email, phone, website, notes, date, hotel, time } = f;
    const details = { Tour: tour.name, Date: date, Time: time, Hotel: hotel, Guests: String(people), Order: lines.map((l) => `${l.label} · ${l.qty} × ${money(l.price)} = ${money(l.qty * l.price)}`).join(" | "), Total: money(total) };
    try {
      const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "booking", name: `${first} ${last}`.trim(), email, phone, message: notes, website, details }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="rounded-xl bg-white p-6 font-bold text-brand">Thank you! Your request is in. Our concierge will confirm your pickup on WhatsApp. You pay later.</p>;
  const ic = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg";
  const f = "w-full rounded-2xl border border-sky-200 bg-sky-50/60 py-4 pl-12 pr-4 text-sm text-ink";
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[28px] border border-sky-100 bg-white p-4 shadow-lg">
      <div className="rounded-3xl bg-sky-50 p-4">
        <span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-extrabold tracking-wider text-amber-900">BEST RATE DIRECT</span>
        <p className="mt-2 text-xs font-bold text-ink/60">Official Trip2 Guarantee</p>
        <p className="mt-1 text-4xl font-black text-brand">{money(tour.from)} <span className="text-xs font-bold text-ink/50">Base Price · per person</span></p>
      </div>
      <div className="grid gap-3 rounded-3xl bg-sky-50 p-4">
        <div className="relative"><span className={ic}>📅</span><input name="date" type="date" required min={today} value={date} onChange={(e) => setDateV(e.target.value)} className={f + " appearance-none"} />{!date && <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-ink/50">Select date*</span>}</div>
        <div className="grid gap-2">
          {opts.map((o, i) => (
            <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-3">
              <div className="text-sm"><b>{o.label}</b><br /><span className="font-extrabold text-brand">{money(o.price)}</span></div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => set(i, -1)} className="h-9 w-9 rounded-full bg-white text-lg font-black text-brand shadow">−</button>
                <span className="w-6 text-center font-bold">{q[i] || 0}</span>
                <button type="button" onClick={() => set(i, 1)} className="h-9 w-9 rounded-full bg-brand text-lg font-black text-white">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="relative"><span className={ic}>🌤️</span><select name="time" required defaultValue="" className={f}><option value="" disabled>Time of Day*</option><option>Morning</option><option>Afternoon</option></select></div>
        <div className="relative"><span className={ic}>🛏️</span><input name="hotel" required placeholder="Hotels*" className={f} /></div>
        <div className="grid grid-cols-2 gap-3"><input name="first" required placeholder="First name *" className={f.replace("pl-12", "pl-4")} /><input name="last" required placeholder="Last name *" className={f.replace("pl-12", "pl-4")} /></div>
        <input name="email" type="email" required placeholder="Email *" className={f.replace("pl-12", "pl-4")} />
        <input name="phone" required placeholder="Phone / WhatsApp *" className={f.replace("pl-12", "pl-4")} />
        <textarea name="notes" rows={2} placeholder="Notes" className={f.replace("pl-12", "pl-4")} />
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        <div className="border-t border-sky-200 pt-3 text-sm">
          {lines.length > 0 ? lines.map((l, i) => <p key={i} className="flex justify-between gap-3 py-0.5"><span className="text-ink/70">{l.label} · {l.qty} × {money(l.price)}</span><b>{money(l.qty * l.price)}</b></p>) : <p className="flex justify-between"><span className="text-ink/70">Base Fee</span><b>{money(tour.from)}</b></p>}
          <p className="mt-2 flex justify-between"><span className="text-ink/70">Resort Roundtrip Pickup</span><b className="text-brand">FREE</b></p>
          {tour.num && /^(2[1-3]|2[6-9]|3[01])$/.test(tour.num) && <p className="mt-2 flex justify-between"><span className="text-ink/70">Montaña Redonda Entry &amp; Swings</span><b className="text-brand">FREE</b></p>}
        </div>
        <div className="flex items-end justify-between border-t border-sky-200 pt-3"><b className="text-brand">Total Amount Due</b><b className="text-3xl text-brand">{money(lines.length ? total : tour.from)}</b></div>
        {tooFew && <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">Minimum 2 people on this tour. Add a Double or a second guest.</p>}
      </div>
      <p className="px-1 text-xs text-ink/60">"From" prices are per person, based on the Double. You pay the Single or Double you select.</p>
      <button disabled={!lines.length || tooFew || state === "sending"} className="rounded-full bg-brand py-4 text-sm font-extrabold text-white disabled:bg-slate-300">{state === "sending" ? "Sending…" : "⚡ RESERVE NOW"}</button>
      <a href="#book" className="rounded-full bg-sky-100 py-3 text-center text-sm font-bold text-brand">💬 Enquiry Form</a>
      {state === "error" && <p className="text-sm font-bold text-rose-600">Something went wrong. Please try again or use WhatsApp.</p>}
      <p className="text-center text-xs text-ink/60">Free cancellation up to 24 hours before.</p>
    </form>
  );
}
