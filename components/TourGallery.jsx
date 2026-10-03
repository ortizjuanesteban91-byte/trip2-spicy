"use client";
import { useCallback, useEffect, useRef, useState } from "react";
// Tour photo gallery: hero grid that adapts to how many photos exist, "View all" opens a swipeable full-screen viewer.
export default function TourGallery({ photos = [], alts = [], title = "", grads = [] }) {
  const [open, setOpen] = useState(-1);
  const x0 = useRef(null);
  const n = photos.length;
  const go = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + n) % n)), [n]);
  useEffect(() => {
    if (open < 0) return;
    const k = (e) => { if (e.key === "Escape") setOpen(-1); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [open, go]);
  const alt = (k) => alts[k] || title;
  const tile = (k, cls, more) => (
    <button key={k} type="button" onClick={() => setOpen(k)} aria-label={`Open photo ${k + 1} of ${n}`} className={`group relative overflow-hidden rounded-2xl ${cls}`}>
      <img src={photos[k]} alt={alt(k)} loading={k ? "lazy" : "eager"} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      {more && <span className="absolute inset-0 grid place-items-center bg-black/45 text-lg font-extrabold text-white">+{n - 5} more</span>}
    </button>
  );
  let grid;
  if (n === 0) grid = <div className={`h-64 rounded-2xl bg-gradient-to-br sm:h-96 ${grads[0] || ""}`} role="img" aria-label={title} />;
  else if (n === 1) grid = tile(0, "h-64 w-full sm:h-[26rem]");
  else if (n === 2) grid = <div className="grid gap-3 sm:grid-cols-2">{tile(0, "h-56 sm:h-80")}{tile(1, "h-44 sm:h-80")}</div>;
  else if (n === 3) grid = <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2">{tile(0, "h-64 sm:col-span-2 sm:row-span-2 sm:h-auto")}{tile(1, "h-32 sm:col-span-2")}{tile(2, "h-32 sm:col-span-2")}</div>;
  else {
    const shown = Math.min(n, 5);
    const small = Array.from({ length: shown - 1 }, (_, j) => j + 1);
    grid = (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tile(0, "col-span-2 h-64 sm:row-span-2 sm:h-auto sm:min-h-[16rem]")}
        {small.map((k) => tile(k, "h-32 sm:h-36", k === shown - 1 && n > shown))}
      </div>
    );
  }
  return (
    <div className="mt-8" data-aos="zoom-in">
      {grid}
      {n > 1 && <button type="button" onClick={() => setOpen(0)} className="mt-3 rounded-full border border-sky-200 bg-white px-5 py-2 text-sm font-extrabold text-brand shadow-sm hover:bg-sky-50">View all {n} photos</button>}
      {open >= 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label={`${title} photos`}
          onTouchStart={(e) => (x0.current = e.touches[0].clientX)} onTouchEnd={(e) => { if (x0.current == null) return; const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); x0.current = null; }}>
          <div className="flex items-center justify-between px-4 py-3 text-white"><span className="text-sm font-bold">{open + 1} / {n}</span><button type="button" onClick={() => setOpen(-1)} className="rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold" aria-label="Close">Close ✕</button></div>
          <div className="relative flex-1">
            <img src={photos[open]} alt={alt(open)} className="absolute inset-0 h-full w-full object-contain" />
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-2xl text-white">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-2xl text-white">›</button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 py-3">{photos.map((p, k) => <button key={p} type="button" onClick={() => setOpen(k)} aria-label={`Photo ${k + 1}`} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg ${k === open ? "ring-2 ring-white" : "opacity-60"}`}><img src={p} alt="" loading="lazy" className="h-full w-full object-cover" /></button>)}</div>
        </div>
      )}
    </div>
  );
}
