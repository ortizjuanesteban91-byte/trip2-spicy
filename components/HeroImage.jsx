"use client";
import { useEffect, useRef, useState } from "react";
// Header photo: a different one each visit AND every time the visitor scrolls down and comes back up to the top.
// Photos cross-fade smoothly (the new one fades in over the old one once it has loaded).
export default function HeroImage({ slides }) {
  const [layers, setLayers] = useState([{ id: 0, i: 0, on: true }]);
  const cur = useRef(0), uid = useRef(0);
  const show = (next) => {
    const im = new Image();
    const go = () => {
      const id = ++uid.current; cur.current = next;
      setLayers((L) => [...L, { id, i: next, on: false }]);
      requestAnimationFrame(() => requestAnimationFrame(() => setLayers((L) => L.map((l) => (l.id === id ? { ...l, on: true } : l)))));
      setTimeout(() => setLayers((L) => L.filter((l) => l.id >= id)), 1600);
    };
    im.onload = go; im.onerror = go; im.src = slides[next].src;
  };
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem("t2hero"));
      const next = Number.isInteger(last) && localStorage.getItem("t2hero") !== null ? (last + 1) % slides.length : 0;
      localStorage.setItem("t2hero", String(next));
      if (next !== 0) show(next);
    } catch {}
  }, [slides.length]);
  useEffect(() => {
    if (slides.length < 2) return;
    let away = false;
    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      if (y > vh * 0.7) away = true;
      else if (y < 60 && away) {
        away = false;
        const next = (cur.current + 1) % slides.length;
        try { localStorage.setItem("t2hero", String(next)); } catch {}
        show(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slides]);
  return (
    <>
      {layers.map((l, k) => (
        <img key={l.id} src={slides[l.i].src} alt={slides[l.i].alt} fetchPriority={k === 0 ? "high" : "auto"} className="hero-zoom absolute inset-0 h-full w-full object-cover" style={{ opacity: l.on ? 1 : 0, transition: "opacity 1.4s ease-in-out" }} />
      ))}
    </>
  );
}
