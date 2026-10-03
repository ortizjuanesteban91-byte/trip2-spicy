"use client";
import { useState } from "react";
import Link from "next/link";
import ComboFusion from "@/components/ComboFusion";
import { photo, strip } from "@/data/photos";
import RatingBadge from "@/components/RatingBadge";
import StarBadge from "@/components/StarBadge";
import { TOP_RATED } from "@/data/site";
import { filterTours } from "@/lib/search";
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const GR = ["from-sky-300 to-teal-700", "from-emerald-300 to-emerald-800", "from-amber-200 to-lime-700", "from-cyan-200 to-blue-700", "from-green-300 to-teal-800", "from-slate-300 to-slate-700"];
export default function TourGrid({ tours, cats: C, initial, initialDest, initialQ = "", ov = {}, rt = null }) {
  const [d, setD] = useState(initialDest);
  const cats = [["all", "All"], ...C];
  const [c, setC] = useState(initial);
  const [qq, setQq] = useState(initialQ);
  const list = filterTours([...tours], qq).sort((a, b) => (a.dest === b.dest ? 0 : a.dest === "punta-cana" ? -1 : 1)).filter((t) => (d === "all" || t.dest === d) && (c === "all" || t.cats.includes(c)));
  return (
    <>
      <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2 rounded-full bg-white p-1.5 shadow ring-1 ring-slate-200">
        {[["punta-cana", "Punta Cana"], ["miches", "Miches"], ["all", "All"]].map(([k, l]) => <button key={k} onClick={() => setD(k)} className={`rounded-full px-3 py-2.5 text-sm font-extrabold ${d === k ? "bg-ink text-white" : "text-ink"}`}>{l}</button>)}
      </div>
      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {cats.map(([x, lbl]) => <button key={x} onClick={() => setC(x)} className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold ${c === x ? "bg-brand text-white" : "bg-white text-brand ring-1 ring-sky-200"}`}>{lbl.toUpperCase()}</button>)}
      </div>
      <input value={qq} onChange={(e) => setQq(e.target.value)} placeholder="Search excursions: ATV, Buggy, Saona…" className="mx-auto mt-4 block w-full max-w-md rounded-full border border-sky-200 bg-white px-5 py-3 text-sm" />
      <p className="mt-4 text-center text-xs text-ink/60">{list.length} tours</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <article key={t.slug} className="relative cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-2xl bg-white shadow-md ring-1 ring-sky-100">
            <div className="relative h-52 overflow-hidden"><div data-aos="zoom-out-right" className={`absolute inset-0 bg-gradient-to-br ${GR[t.i % 6]}`} />{strip(t.slug) && !ov[t.slug] ? <ComboFusion urls={strip(t.slug)} name={t.name} /> : (ov[t.slug] || photo(t.slug)) && <img data-aos="zoom-out-right" src={ov[t.slug] || photo(t.slug)} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}<span className="absolute left-3 top-3 z-10 pointer-events-none rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold text-ink">{(cats.find(([k]) => k === t.cat) || [0, ""])[1].toUpperCase()}</span><StarBadge top={TOP_RATED.has(t.slug)} /></div>
            <div className="p-5">
              <div data-aos="zoom-out-left"><p className="text-[10px] font-extrabold tracking-widest text-brand/70">EXCURSION</p>
              <h2 className="mt-1 text-lg font-extrabold leading-snug">{t.title}</h2>
              <RatingBadge /></div>
              <div className="mt-4 flex items-end justify-between"><p className="text-xs text-ink/60">From<br /><b className="text-2xl text-brand">{money(t.from)}</b> / person</p><Link href={`/tour/${t.slug}`} className="rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold text-white after:absolute after:inset-0 after:z-20 after:content-[''] hover:bg-brand-hover">VIEW TOUR</Link></div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
