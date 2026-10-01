"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, mirror: false, offset: 60 });
    const t = setTimeout(() => AOS.refresh(), 300);
    return () => clearTimeout(t);
  }, []);
  return null;
}
