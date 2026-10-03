"use client";
import { useEffect, useState } from "react";
// Shows a different header photo each time a visitor comes back to the page (remembers the last one in this browser).
export default function HeroImage({ slides }) {
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(true);
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem("t2hero"));
      const next = Number.isInteger(last) && localStorage.getItem("t2hero") !== null ? (last + 1) % slides.length : 0;
      localStorage.setItem("t2hero", String(next));
      if (next !== 0) { setReady(false); setI(next); }
    } catch {}
  }, [slides.length]);
  const s = slides[i];
  return <img key={i} src={s.src} alt={s.alt} fetchPriority="high" onLoad={() => setReady(true)} className={`hero-zoom absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />;
}
