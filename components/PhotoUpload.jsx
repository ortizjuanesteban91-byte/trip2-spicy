"use client";
import { useState } from "react";
// Shrinks each photo in the browser (max 1600px, JPEG) so it uploads fast on mobile data, then sends it one by one.
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return null;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file.size < 4_000_000 ? file : null;
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", 0.82));
}
export default function PhotoUpload({ name, label, max = 15, text = {} }) {
  const t = { add: "Add photos", busy: "Uploading...", fail: "Could not upload. You can send the photos on WhatsApp.", limit: `Up to ${max} photos`, ...text };
  const [urls, setUrls] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(e) {
    const files = [...e.target.files].slice(0, max - urls.length);
    e.target.value = ""; setBusy(true); setErr("");
    const added = [];
    for (const f of files) {
      try {
        const blob = await shrink(f); if (!blob) { setErr(t.fail); continue; }
        const fd = new FormData(); fd.append("file", blob, "photo.jpg");
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.url) added.push(j.url); else setErr(t.fail);
      } catch { setErr(t.fail); }
    }
    setUrls((u) => [...u, ...added]); setBusy(false);
  }
  return (
    <div className="grid gap-2 text-sm font-bold">
      {label}
      <input type="hidden" name={name} value={urls.join(" ")} />
      <div className="flex flex-wrap gap-2">
        {urls.map((u) => <span key={u} className="relative"><img src={u} alt="" className="h-20 w-20 rounded-lg object-cover" /><button type="button" onClick={() => setUrls(urls.filter((x) => x !== u))} className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-black/70 text-white" aria-label="Remove">×</button></span>)}
        {urls.length < max && <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#d9dee5] text-center text-xs font-bold text-brand"><input type="file" accept="image/*" multiple onChange={pick} className="hidden" />{busy ? t.busy : `+ ${t.add}`}</label>}
      </div>
      <span className="text-xs font-normal text-[#667085]">{t.limit}</span>
      {err && <span className="text-xs font-normal text-red-600">{err}</span>}
    </div>
  );
}
