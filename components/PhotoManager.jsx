"use client";
import { useState } from "react";
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return null;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file.size < 4_000_000 ? file : null;
  const k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", 0.86));
}
async function up(file) {
  const blob = await shrink(file); if (!blob) throw new Error("Use a JPG, PNG or WebP photo.");
  const fd = new FormData(); fd.append("file", blob, "photo.jpg");
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.url) throw new Error("Upload failed. Try again.");
  return j.url;
}
const btn = "rounded-lg border border-[#d9dee5] bg-white px-3 py-1.5 text-xs font-bold";
function Pick({ onUrl, children, setErr, setBusy }) {
  return (
    <label className={`${btn} cursor-pointer text-brand`}>
      {children}
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setBusy(true); setErr(""); try { onUrl(await up(f)); } catch (x) { setErr(x.message); } setBusy(false); }} />
    </label>
  );
}
export default function PhotoManager({ initialHero, defaultHero, cards, cats }) {
  const [hero, setHero] = useState(initialHero);
  const [cardOv, setCardOv] = useState(Object.fromEntries(cards.filter((c) => c.cur).map((c) => [c.key, c.cur])));
  const [catOv, setCatOv] = useState(Object.fromEntries(cats.filter((c) => c.cur).map((c) => [c.key, c.cur])));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const move = (i, d) => setHero((h) => { const a = [...h]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });
  async function save() {
    setBusy(true); setMsg(""); setErr("");
    const r = await fetch("/api/admin/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hero, cards: cardOv, cats: catOv }) });
    setBusy(false);
    if (r.ok) setMsg("Saved. The website updates within a minute."); else setErr("Could not save. Try again.");
  }
  const Grid = ({ items, ov, setOv }) => (
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => { const src = ov[c.key] || c.def; return (
        <div key={c.key} className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="h-32 bg-slate-200">{src && <img src={src} alt="" className="h-full w-full object-cover" />}</div>
          <div className="p-3"><p className="text-sm font-extrabold leading-snug">{c.name}</p>
            <div className="mt-2 flex flex-wrap gap-2"><Pick onUrl={(u) => setOv((o) => ({ ...o, [c.key]: u }))} setErr={setErr} setBusy={setBusy}>Change photo</Pick>
              {ov[c.key] && <button type="button" className={btn} onClick={() => setOv((o) => { const n = { ...o }; delete n[c.key]; return n; })}>Use original</button>}</div></div>
        </div>); })}
    </div>
  );
  return (
    <div className="mt-6 grid gap-10 pb-28">
      <section>
        <h2 className="text-xl font-extrabold">1. Header photos (home page)</h2>
        <p className="mt-1 text-sm text-[#667085]">Visitors see the next photo each time they come back. The top one shows first. Use wide, sharp photos (at least 1600 px wide).</p>
        {!hero.length && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Using the built-in photos below. Add your own to replace them.</p>}
        <div className="mt-3 grid gap-3">
          {(hero.length ? hero : defaultHero).map((h, i) => (
            <div key={h.src + i} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow">
              <span className="w-6 text-center text-sm font-extrabold">{i + 1}</span>
              <img src={h.src} alt="" className="h-20 w-32 rounded-lg object-cover" />
              {hero.length > 0 && (<>
                <input value={h.alt} onChange={(e) => setHero((a) => a.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} placeholder="Short description (for Google)" className="min-w-0 flex-1 rounded-lg border border-[#d9dee5] p-2 text-sm" />
                <button type="button" className={btn} onClick={() => move(i, -1)}>↑</button><button type="button" className={btn} onClick={() => move(i, 1)}>↓</button>
                <button type="button" className={btn} onClick={() => setHero((a) => a.filter((_, k) => k !== i))}>Remove</button></>)}
            </div>))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pick onUrl={(u) => setHero((a) => [...(a.length ? a : []), { src: u, alt: "Punta Cana excursions" }])} setErr={setErr} setBusy={setBusy}>+ Add header photo</Pick>
          {!hero.length && <button type="button" className={btn} onClick={() => setHero(defaultHero.map((x) => ({ ...x })))}>Start from the built-in photos</button>}
        </div>
      </section>
      <section><h2 className="text-xl font-extrabold">2. Tour card photos</h2><p className="mt-1 text-sm text-[#667085]">The picture on each excursion card (home page and the tours list).</p><Grid items={cards} ov={cardOv} setOv={setCardOv} /></section>
      <section><h2 className="text-xl font-extrabold">3. Category photos</h2><p className="mt-1 text-sm text-[#667085]">The picture on each category card on the home page.</p><Grid items={cats} ov={catOv} setOv={setCatOv} /></section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center gap-3">
        <button type="button" disabled={busy} onClick={save} className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white disabled:opacity-60">{busy ? "Working..." : "Save photos"}</button>
        <span className="text-sm font-bold text-emerald-700">{msg}</span><span className="text-sm font-bold text-red-700">{err}</span></div></div>
    </div>
  );
}
