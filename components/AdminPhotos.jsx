"use client";
import { useState } from "react";
// Photo manager: upload from phone, remove, make main (first photo = cover). Saves as space-separated URLs.
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return null;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file.size < 4_000_000 ? file : null;
  const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", 0.85));
}
export default function AdminPhotos({ name, initial = [], max = 60 }) {
  const [urls, setUrls] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(e) {
    const files = [...e.target.files]; e.target.value = ""; setBusy(true); setErr("");
    const added = [];
    for (const f of files) {
      try {
        const blob = await shrink(f); if (!blob) { setErr("One file was skipped (use JPG, PNG or WebP)."); continue; }
        const fd = new FormData(); fd.append("file", blob, "photo.jpg");
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.url) added.push(j.url); else setErr("Upload failed (is Supabase connected?). Try again.");
      } catch { setErr("Upload failed. Try again."); }
    }
    setUrls((u) => [...u, ...added].slice(max === 1 ? -1 : 0, max === 1 ? undefined : max)); setBusy(false);
  }
  const main = (u) => setUrls([u, ...urls.filter((x) => x !== u)]);
  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={urls.join(" ")} />
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u} className="w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-24 w-28 rounded-lg object-cover" />
            <div className="mt-1 flex items-center justify-between text-xs font-bold">
              {i === 0 ? <span className="text-brand">Main photo</span> : <button type="button" onClick={() => main(u)} className="text-brand underline">Make main</button>}
              <button type="button" onClick={() => setUrls(urls.filter((x) => x !== u))} className="text-red-600" aria-label="Remove photo">Remove</button>
            </div>
          </div>
        ))}
        {urls.length < max || max === 1 ? <label className="flex h-24 w-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#d9dee5] text-center text-xs font-bold text-brand">
          <input type="file" accept="image/*" multiple onChange={pick} className="hidden" />{busy ? "Uploading..." : max === 1 ? (urls.length ? "Change photo" : "+ Add photo") : "+ Add photos"}
        </label> : null}
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}
