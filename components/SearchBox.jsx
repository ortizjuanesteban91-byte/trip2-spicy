"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { filterTours } from "@/lib/search";
export default function SearchBox({ tours }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inp = useRef(null);
  const router = useRouter();
  useEffect(() => { if (open) inp.current?.focus(); }, [open]);
  useEffect(() => { const k = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  const res = q.trim() ? filterTours(tours, q).slice(0, 8) : [];
  const go = (e) => { e.preventDefault(); if (q.trim()) { setOpen(false); router.push(`/tours?q=${encodeURIComponent(q.trim())}`); } };
  return (
    <>
      <button type="button" aria-label="Search excursions" onClick={() => setOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow ring-1 ring-sky-200 hover:bg-sky-50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 px-3 pt-20" onClick={() => setOpen(false)}>
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={go} className="flex gap-2">
              <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search excursions: ATV, Buggy, Saona…" className="w-full rounded-full border border-sky-200 px-5 py-3 text-sm" />
              <button className="rounded-full bg-brand px-5 text-xs font-extrabold text-white">GO</button>
            </form>
            {q.trim() && (res.length ? (
              <ul className="mt-3 max-h-[60vh] divide-y divide-sky-100 overflow-y-auto">
                {res.map((t) => (
                  <li key={t.slug}><Link href={`/tour/${t.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between gap-3 py-3 text-sm font-bold hover:text-brand"><span>{t.title || t.name}</span><span className="shrink-0 text-xs text-brand">from ${t.from}</span></Link></li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-ink/60">No tours found. Try another word.</p>)}
            {q.trim() && <Link href={`/tours?q=${encodeURIComponent(q.trim())}`} onClick={() => setOpen(false)} className="mt-3 block text-center text-xs font-extrabold text-brand">See all results</Link>}
          </div>
        </div>
      )}
    </>
  );
}
