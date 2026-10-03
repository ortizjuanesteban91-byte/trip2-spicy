"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// A call-to-action that lights up (pulsing glow) every time it scrolls into view.
export default function GlowLink({ className = "", glow = "gold", children, ...p }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { setOn(e.isIntersecting); }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Link ref={ref} className={`${className} ${on ? "cta-glow-" + glow : ""}`} {...p}>{children}</Link>;
}
