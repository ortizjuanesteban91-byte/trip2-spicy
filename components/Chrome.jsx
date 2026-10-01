"use client";
import { usePathname } from "next/navigation";
import AdminBar from "./AdminBar";
import ChatWidget from "./ChatWidget";
// Public header/footer/WhatsApp button are hidden inside /admin, which has its own menu.
export default function Chrome({ top, bottom, children }) {
  const admin = (usePathname() || "").startsWith("/admin");
  return (<>{!admin && <AdminBar />}{!admin && top}<div className="page-clip">{children}{!admin && bottom}</div>{!admin && <ChatWidget />}</>);
}
