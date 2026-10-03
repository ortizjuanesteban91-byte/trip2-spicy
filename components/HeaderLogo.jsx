"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// Shows "Trip2 Miches" on the Miches hub (/m), on Miches tour pages, on /tours?dest=miches and on michestour.com.
function useMiches(michesSlugs) {
  const path = usePathname() || "/";
  const [host, setHost] = useState(false);
  const [dest, setDest] = useState(false);
  useEffect(() => {
    setHost(/(^|\.)michestour\.com$/i.test(window.location.hostname));
    setDest(path.startsWith("/tours") && new URLSearchParams(window.location.search).get("dest") === "miches");
  }, [path]);
  const slug = path.startsWith("/tour/") ? path.split("/")[2] : "";
  const miches = host || dest || path === "/m" || path.startsWith("/m/") || michesSlugs.includes(slug);
  return miches;
}
export default function HeaderLogo({ michesSlugs = [] }) {
  const miches = useMiches(michesSlugs);
  return (
    <Link href={miches ? "/m" : "/"} aria-label={miches ? "Trip2 Miches home" : "Trip2 Punta Cana home"}>
      <img src={miches ? "/img/logo-miches.webp?v=3" : "/img/logo.webp"} alt={miches ? "Trip2 Miches" : "Trip2 Punta Cana"} width="140" height="52" className="block h-[58px] w-auto" />
    </Link>
  );
}

// Slim bar under the header on Miches pages so guests can always get back to Punta Cana (and vice versa from the hub).
export function DestBar({ michesSlugs = [] }) {
  const miches = useMiches(michesSlugs);
  if (!miches) return null;
  return (
    <div className="border-t border-sky-100/60 bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-1.5 text-[12px] font-bold sm:px-5">
        <Link href="/" className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 font-extrabold text-white shadow-sm hover:bg-brand-hover">&larr; Back to Punta Cana</Link>
        <span className="text-brand/70">Trip2 Miches</span>
      </div>
    </div>
  );
}
