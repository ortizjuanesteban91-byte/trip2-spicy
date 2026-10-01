"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

// Cards/lists replay on scroll; a tour page animates once per visit, then stays still.
export default function AosInit() {
  const path = usePathname();
  useEffect(() => {
    AOS.init({ duration: 2000, once: path.startsWith("/tour/"), mirror: false, offset: 60 });
    const t = setTimeout(() => AOS.refreshHard(), 300);
    return () => clearTimeout(t);
  }, [path]);
  return null;
}
