import { getSession, can, ROLES } from "@/lib/admin";
import AdminShell from "@/components/AdminShell";
export const dynamic = "force-dynamic";
const ITEMS = [["leads", "Bookings & leads", "/admin", "📥"], ["tours", "Tours", "/admin/tours", "🌴"], ["tours", "Photos", "/admin/photos", "🖼️"], ["affiliates", "Affiliates", "/admin/affiliates", "🤝"], ["leads", "Chats", "/admin/chats", "💬"], ["reviews", "Reviews", "/admin/reviews", "⭐"], ["blog", "Blog", "/admin/blog", "📝"], ["settings", "Settings & payments", "/admin/settings", "⚙️"], ["users", "Users", "/admin/users", "👥"]];
export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) return <div className="min-h-screen bg-[#f4f7fc]">{children}</div>;
  return (
    <AdminShell items={ITEMS.filter(([k]) => can(session, k))} user={session.name || "Owner"} role={ROLES[session.role]?.label.split(" (")[0]}>
      {children}
    </AdminShell>
  );
}
