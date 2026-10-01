"use client";
import { useState } from "react";
import Link from "next/link";
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const GR = ["from-sky-300 to-teal-700", "from-emerald-300 to-emerald-800", "from-amber-200 to-lime-700", "from-cyan-200 to-blue-700", "from-green-300 to-teal-800", "from-slate-300 to-slate-700"];
export default function TourGrid({ tours, cats: C, initial }) {
  const cats = [["all", "All"], ...C];
  const [c, setC] = useState(initial);
  const [qq, setQq] = useState("");
  const list = tours.filter((t) => (c === "all" || t.cats.includes(c)) && (!qq || (t.name + t.meta).toLowerCase().includes(qq.toLowerCase())));
  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map(([x, lbl]) => <button key={x} onClick={() => setC(x)} className={`rounded-full px-5 py-2 text-xs font-extrabold ${c === x ? "bg-brand text-white" : "bg-white text-brand ring-1 ring-sky-200"}`}>{lbl.toUpperCase()}</button>)}
      </div>
      <input value={qq} onChange={(e) => setQq(e.target.value)} placeholder="Search tours" className="mx-auto mt-4 block w-full max-w-md rounded-full border border-sky-200 bg-white px-5 py-3 text-sm" />
      <p className="mt-4 text-center text-xs text-ink/60">{list.length} tours</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <article key={t.slug} className="relative cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-2xl bg-white shadow-md ring-1 ring-sky-100">
            <div className="relative h-52 overflow-hidden"><div data-aos="zoom-out-right" className={`absolute inset-0 bg-gradient-to-br ${GR[t.i % 6]}`} /><span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold text-ink">{(cats.find(([k]) => k === t.cat) || [0, ""])[1].toUpperCase()}</span></div>
            <div className="p-5" data-aos="zoom-out-left">
              <p className="text-[10px] font-extrabold tracking-widest text-brand/70">EXCURSION</p>
              <h2 className="mt-1 text-lg font-extrabold leading-snug">{t.title}</h2>
              <p className="mt-2 text-xs text-ink/60">Verified Guide · Hotel pickup</p>
              <div className="mt-4 flex items-end justify-between"><p className="text-xs text-ink/60">From<br /><b className="text-2xl text-brand">{money(t.from)}</b> / person</p><Link href={`/tour/${t.slug}`} className="rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold text-white after:absolute after:inset-0 after:content-[''] hover:bg-brand-hover">VIEW TOUR</Link></div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
