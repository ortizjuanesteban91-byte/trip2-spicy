"use client";
import { useState } from "react";
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export default function BookingBox({ tour }) {
  const [q, setQ] = useState({});
  const [state, setState] = useState("idle");
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
    const { first, last, email, phone, website, notes, date, hotel } = f;
    const details = { Tour: tour.name, Date: date, Hotel: hotel, Guests: String(people), Order: lines.map((l) => `${l.label} · ${l.qty} × ${money(l.price)} = ${money(l.qty * l.price)}`).join(" | "), Total: money(total) };
    try {
      const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "booking", name: `${first} ${last}`.trim(), email, phone, message: notes, website, details }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="rounded-xl bg-white p-6 font-bold text-brand">Thank you! Your request is in. Our concierge will confirm your pickup on WhatsApp. You pay later.</p>;
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 shadow ring-1 ring-sky-100">
      <h3 className="font-extrabold">Choose your option</h3>
      <div className="grid gap-2">
        {opts.map((o, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-ice p-3">
            <div className="text-sm"><b>{o.label}</b><br /><span className="text-brand font-extrabold">{money(o.price)}</span></div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => set(i, -1)} className="h-9 w-9 rounded-full bg-white text-lg font-black text-brand shadow">−</button>
              <span className="w-6 text-center font-bold">{q[i] || 0}</span>
              <button type="button" onClick={() => set(i, 1)} className="h-9 w-9 rounded-full bg-brand text-lg font-black text-white">+</button>
            </div>
          </div>
        ))}
      </div>
      {lines.length > 0 && (
        <div className="rounded-xl border border-sky-100 p-3 text-sm">
          {lines.map((l, i) => <p key={i} className="py-0.5">{tour.name} · {l.label} · {l.qty} × {money(l.price)} = <b>{money(l.qty * l.price)}</b></p>)}
          <p className="mt-2 border-t pt-2 font-extrabold">Total: {money(total)} ({people} {people === 1 ? "person" : "people"})</p>
        </div>
      )}
      {tooFew && <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">Minimum 2 people on this tour. Add a Double or a second guest.</p>}
      <p className="text-xs text-ink/60">"From" prices are per person, based on the Double. You pay the Single or Double you select.</p>
      <div className="grid grid-cols-2 gap-3"><input name="first" required placeholder="First name *" className={inp} /><input name="last" required placeholder="Last name *" className={inp} /></div>
      <input name="email" type="email" required placeholder="Email *" className={inp} />
      <input name="phone" required placeholder="Phone / WhatsApp *" className={inp} />
      <div className="grid grid-cols-2 gap-3"><input name="date" type="date" required className={inp} /><input name="hotel" placeholder="Hotel name" className={inp} /></div>
      <textarea name="notes" rows={3} placeholder="Notes" className={inp} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <button disabled={!lines.length || tooFew || state === "sending"} className="rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white disabled:opacity-40">{state === "sending" ? "Sending…" : "RESERVE NOW – PAY LATER"}</button>
      {state === "error" && <p className="text-sm font-bold text-rose-600">Something went wrong. Please try again or use WhatsApp.</p>}
      <p className="text-xs text-ink/60">Free cancellation up to 24 hours before.</p>
    </form>
  );
}
