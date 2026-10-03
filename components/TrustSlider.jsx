"use client";
import { useEffect, useRef, useState } from "react";
// Phone: swipeable carousel that also slides by itself. Tablet/desktop: normal grid.
export default function TrustSlider({ items }) {
  const box = useRef(null);
  const [cur, setCur] = useState(0);
  const touched = useRef(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onScroll = () => { const w = el.firstChild?.getBoundingClientRect().width || 1; setCur(Math.round(el.scrollLeft / (w + 16))); };
    const stop = () => { touched.current = true; };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    const t = setInterval(() => {
      if (touched.current || !window.matchMedia("(max-width: 639px)").matches) return;
      const kids = el.children, next = (cur + 1) % kids.length;
      el.scrollTo({ left: kids[next].offsetLeft - kids[0].offsetLeft, behavior: "smooth" });
    }, 4200);
    return () => { clearInterval(t); el.removeEventListener("scroll", onScroll); el.removeEventListener("touchstart", stop); };
  }, [cur]);
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:py-12">
      <div ref={box} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
        {items.map(([t, d]) => (
          <div key={t} className="min-w-[82%] snap-center rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:min-w-0">
            <h3 className="text-base font-extrabold text-brand">{t}</h3>
            <p className="mt-1 text-sm text-ink/70">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2 sm:hidden" aria-hidden="true">
        {items.map(([t], i) => <span key={t} className={`h-2 rounded-full transition-all ${i === cur ? "w-6 bg-brand" : "w-2 bg-brand/25"}`} />)}
      </div>
    </section>
  );
}
