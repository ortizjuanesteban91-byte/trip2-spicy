"use client";
import { useState } from "react";
import { VEHICLES, ZONES } from "@/data/transfers";
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
export default function TransferBox({ wa }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ trip: "Airport → Hotel", zone: "bavaro", hotel: "", date: "", time: "", flight: "", pax: 2, vehicle: "suv", rdate: "", rtime: "" });
  const [f, setF] = useState({ name: "", phone: "", email: "" });
  const [state, setState] = useState("idle");
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const v = VEHICLES.find((x) => x.id === d.vehicle);
  const one = v.prices[d.zone];
  const legs = d.trip === "Round trip" ? 2 : 1;
  const total = one == null ? null : one * legs;
  const pick = (x) => { const n = Math.max(1, Math.min(59, x)); setD((p) => ({ ...p, pax: n, vehicle: n <= 5 ? "suv" : n <= 10 ? "van" : n <= 20 ? "minibus" : "bus" })); };
  const ok1 = d.hotel && d.date && d.time;
  async function send(e) {
    e.preventDefault(); setState("sending");
    const details = { Trip: d.trip, Zone: ZONES.find((z) => z[0] === d.zone)[1], "Hotel / address": d.hotel, Date: d.date, Time: d.time, Flight: d.flight, Guests: String(d.pax), Vehicle: v.name, ...(d.trip === "Round trip" ? { "Return date": d.rdate, "Return time": d.rtime } : {}), ...(total != null ? { "Price shown": `$${total}` } : {}) };
    try {
      const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "transfer", name: f.name, phone: f.phone, email: f.email, website: e.target.website?.value, details }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <div className="rounded-2xl bg-white p-8 text-center shadow"><p className="text-3xl">✅</p><p className="mt-2 text-xl font-black text-brand">Request received</p><p className="mt-2 text-[#667085]">We will confirm your driver{total == null ? " and price" : ""} on WhatsApp or email shortly.</p><a href={wa} className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-extrabold text-white">Chat on WhatsApp</a><p className="mt-6 border-t border-sky-100 pt-5 font-extrabold text-brand">While you are here: make the most of your trip</p><div className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-bold">{[["Saona Island", "/tour/saona-island"], ["All excursions", "/tours"], ["Best-selling adventures", "/tours/adventure-safari"]].map(([a, h]) => <a key={h} href={h} className="rounded-full bg-sky-50 px-4 py-2 text-brand ring-1 ring-sky-200">{a}</a>)}</div></div>;
  const dot = (n, t) => <div className={`flex items-center gap-2 text-sm font-extrabold ${step >= n ? "text-brand" : "text-[#98a2b3]"}`}><span className={`grid h-7 w-7 place-items-center rounded-full ${step >= n ? "bg-brand text-white" : "bg-[#eef2f6]"}`}>{n}</span>{t}</div>;
  return (
    <form onSubmit={send} className="rounded-2xl bg-white p-5 shadow-lg sm:p-7">
      <div className="mb-5 flex flex-wrap justify-between gap-2">{dot(1, "Trip")}{dot(2, "Vehicle")}{dot(3, "Confirm")}</div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      {step === 1 && <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-2">{["Airport → Hotel", "Hotel → Airport", "Round trip"].map((t) => <button type="button" key={t} onClick={() => setD({ ...d, trip: t })} className={`rounded-xl border p-3 text-xs font-extrabold sm:text-sm ${d.trip === t ? "border-brand bg-brand text-white" : "border-[#d9dee5]"}`}>{t}</button>)}</div>
        <label className="grid gap-1 text-sm font-bold">Area<select value={d.zone} onChange={set("zone")} className={inp}>{ZONES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold">Hotel or address *<input value={d.hotel} onChange={set("hotel")} placeholder="e.g. Hard Rock Hotel, Bávaro" className={inp} /></label>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-bold">Date *<input type="date" value={d.date} onChange={set("date")} className={inp} /></label><label className="grid gap-1 text-sm font-bold">{d.trip === "Hotel → Airport" ? "Pick-up time *" : "Flight landing time *"}<input type="time" value={d.time} onChange={set("time")} className={inp} /></label></div>
        <label className="grid gap-1 text-sm font-bold">Flight number (optional)<input value={d.flight} onChange={set("flight")} placeholder="e.g. AA 1234" className={inp} /></label>
        {d.trip === "Round trip" && <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-bold">Return date<input type="date" value={d.rdate} onChange={set("rdate")} className={inp} /></label><label className="grid gap-1 text-sm font-bold">Pick-up time<input type="time" value={d.rtime} onChange={set("rtime")} className={inp} /></label></div>}
        <button type="button" disabled={!ok1} onClick={() => setStep(2)} className="rounded-full bg-brand py-3.5 font-extrabold text-white disabled:opacity-40">Next: choose vehicle</button>
      </div>}
      {step === 2 && <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d9dee5] bg-white p-3"><span className="text-sm font-bold">How many guests?</span>
          <div className="flex items-center gap-2"><button type="button" onClick={() => pick(d.pax - 1)} aria-label="Fewer guests" className="grid h-11 w-11 place-items-center rounded-full bg-sky-100 text-2xl font-black text-brand">−</button><input type="number" inputMode="numeric" min="1" max="59" value={d.pax} onFocus={(e) => e.target.select()} onChange={(e) => pick(Number(e.target.value) || 1)} aria-label="Number of guests" className="h-11 w-16 rounded-xl border border-sky-200 text-center text-lg font-black" /><button type="button" onClick={() => pick(d.pax + 1)} aria-label="More guests" className="grid h-11 w-11 place-items-center rounded-full bg-brand text-2xl font-black text-white">+</button></div></div>
        <div className="grid gap-2">{VEHICLES.filter((x) => x.id === d.vehicle).map((x) => { const p = x.prices[d.zone]; return <button type="button" key={x.id} onClick={() => setD({ ...d, vehicle: x.id })} className={`flex items-center justify-between rounded-xl border p-4 text-left ${d.vehicle === x.id ? "border-brand bg-sky-50" : "border-[#d9dee5]"}`}><span><b>{x.name}</b><br /><span className="text-xs text-[#667085]">{x.seats} · {x.bags}</span></span><b className="text-brand">{p == null ? "Price on request" : `$${p * legs}`}</b></button>; })}</div>
        <div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className="rounded-full border border-[#d9dee5] px-6 py-3.5 font-extrabold">Back</button><button type="button" onClick={() => setStep(3)} className="flex-1 rounded-full bg-brand py-3.5 font-extrabold text-white">Next: your details</button></div>
      </div>}
      {step === 3 && <div className="grid gap-4">
        <div className="rounded-xl bg-sky-50 p-4 text-sm"><b>{d.trip}</b> · {d.hotel}<br />{d.date} at {d.time} · {d.pax} guest{d.pax > 1 ? "s" : ""} · {v.name}<br /><b className="text-brand">{total == null ? "Price confirmed on WhatsApp within minutes" : `Total $${total}`}</b></div>
        <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name *" className={inp} />
        <input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="WhatsApp / phone *" className={inp} />
        <input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email *" className={inp} />
        {state === "error" && <p className="text-sm font-bold text-red-600">Something went wrong. Please message us on WhatsApp.</p>}
        <div className="flex gap-3"><button type="button" onClick={() => setStep(2)} className="rounded-full border border-[#d9dee5] px-6 py-3.5 font-extrabold">Back</button><button disabled={state === "sending" || !f.name || !f.phone || !f.email} className="flex-1 rounded-full bg-brand py-3.5 font-extrabold text-white disabled:opacity-40">{state === "sending" ? "Sending…" : "Request my transfer"}</button></div>
      </div>}
    </form>
  );
}
