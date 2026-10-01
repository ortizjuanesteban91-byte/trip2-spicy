"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// Shown on the public website only to logged-in admins (marker cookie set at login), so they can jump back to the back end.
export default function AdminBar() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (/(?:^|; )adm_on=1/.test(document.cookie)) { setOn(true); return; }
    // logged in before the marker existed: ask once per browser session
    let done = false; try { done = sessionStorage.getItem("adm_checked") === "1"; sessionStorage.setItem("adm_checked", "1"); } catch {}
    if (done) return;
    fetch("/api/admin/me", { cache: "no-store" }).then((r) => r.json()).then((j) => setOn(!!j.admin)).catch(() => {});
  }, []);
  if (!on) return null;
  return (
    <>
      <div className="flex items-center gap-3 bg-[#0d1626] px-3 py-2 text-sm font-bold text-white">
        <Link href="/admin" className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-extrabold text-white shadow"><span aria-hidden="true">▦</span> Dashboard</Link>
        <span className="text-[#7dd3c7]">Admin mode: only you see this bar</span>
      </div>
      <Link href="/admin" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-lg"><span aria-hidden="true">▦</span> Dashboard</Link>
    </>
  );
}
