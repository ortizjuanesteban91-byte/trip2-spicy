"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// Admin has its own menu (not the public website menu): top bar + side menu.
export default function AdminShell({ items, user, role, children }) {
  const path = usePathname() || "/admin";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const on = (href) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  const current = items.find(([, , href]) => on(href));
  const Menu = (
    <nav className="grid gap-1" aria-label="Admin menu">
      {items.map(([k, label, href, icon]) => (
        <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-bold transition ${on(href) ? "bg-white text-[#0d1626]" : "text-[#d7dee7] hover:bg-white/10"}`}>
          <span className="w-6 text-center text-lg" aria-hidden="true">{icon}</span>{label}
        </Link>
      ))}
    </nav>
  );
  const Foot = (
    <div className="grid gap-2 border-t border-white/10 pt-4 text-sm">
      <p className="px-1 text-[#98a2b3]">{user === role ? role : `${user} · ${role}`}</p>
      <Link href="/" className="rounded-xl px-4 py-2.5 font-bold text-[#d7dee7] hover:bg-white/10">↗ View website</Link>
      <form method="post" action="/api/admin/logout"><button className="w-full rounded-xl px-4 py-2.5 text-left font-bold text-[#fca5a5] hover:bg-white/10">Log out</button></form>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#f4f7fc] lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[#0d1626] p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div>
          <p className="px-2 pb-1 text-lg font-extrabold text-white">Trip2 Spicy</p>
          <p className="px-2 pb-5 text-xs font-bold tracking-widest text-[#7dd3c7]">ADMIN</p>
          {Menu}
        </div>
        {Foot}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between bg-[#0d1626] px-4 py-3 text-white lg:hidden">
          <div><p className="text-xs font-bold tracking-widest text-[#7dd3c7]">TRIP2 ADMIN</p><p className="text-lg font-extrabold">{current?.[1] || "Admin"}</p></div>
          <button type="button" aria-label="Open admin menu" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-2xl">{open ? "✕" : "☰"}</button>
        </header>
        {open && (
          <div className="fixed inset-x-0 top-[68px] bottom-0 z-30 overflow-auto bg-[#0d1626] p-4 lg:hidden">
            {Menu}
            <div className="mt-6">{Foot}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
