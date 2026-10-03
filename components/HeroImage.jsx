"use client";
import { useEffect, useState } from "react";
// Shows a different header photo each visit AND every time the visitor scrolls down and comes back up to the top.
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
  // Scrolled down past the header, then back up to the top: fade to the next photo.
  useEffect(() => {
    if (slides.length < 2) return;
    let away = false;
    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      if (y > vh * 0.7) away = true;
      else if (y < 60 && away) {
        away = false;
        setI((n) => {
          const next = (n + 1) % slides.length;
          const im = new Image(); im.src = slides[next].src; // preload so the swap is smooth
          setReady(false);
          try { localStorage.setItem("t2hero", String(next)); } catch {}
          return next;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slides]);
  const s = slides[i];
  return <img key={i} src={s.src} alt={s.alt} fetchPriority="high" onLoad={() => setReady(true)} className={`hero-zoom absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />;
}
