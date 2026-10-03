"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// Shows "Trip2 Miches" on the Miches hub (/m), on Miches tour pages, on /tours?dest=miches and on michestour.com.
export default function HeaderLogo({ michesSlugs = [] }) {
  const path = usePathname() || "/";
  const [host, setHost] = useState(false);
  const [dest, setDest] = useState(false);
  useEffect(() => {
    setHost(/(^|\.)michestour\.com$/i.test(window.location.hostname));
    setDest(path.startsWith("/tours") && new URLSearchParams(window.location.search).get("dest") === "miches");
  }, [path]);
  const slug = path.startsWith("/tour/") ? path.split("/")[2] : "";
  const miches = host || dest || path === "/m" || path.startsWith("/m/") || michesSlugs.includes(slug);
  return (
    <Link href={miches ? "/m" : "/"} aria-label={miches ? "Trip2 Miches home" : "Trip2 Punta Cana home"}>
      <img src={miches ? "/img/logo-miches.webp" : "/img/logo.webp"} alt={miches ? "Trip2 Miches" : "Trip2 Punta Cana"} width="140" height="52" className="block h-[58px] w-auto" />
    </Link>
  );
}
