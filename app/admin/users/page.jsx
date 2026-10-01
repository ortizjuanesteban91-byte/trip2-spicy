import { redirect } from "next/navigation";
import { getSession, can, firstArea, listStaff, ROLES, ASSIGNABLE } from "@/lib/admin";
export const dynamic = "force-dynamic";
export const metadata = { title: "Users | Admin", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const MSG = { ok: "Saved.", exists: "That email already has an account.", bad: "Please fill name, a valid email and a password of at least 8 characters.", db: "Could not save. Run the latest SQL (staff table) in Supabase." };
export default async function Page({ searchParams }) {
  const { m } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "users")) redirect(firstArea(session));
  const staff = await listStaff();
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-[#667085]">Add people and choose what each can do. You (owner) log in with your admin password and always have full access.</p>
      {m && <p className={`mt-4 rounded-xl p-3 text-sm font-bold ${m === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{MSG[m] || m}</p>}

      <form method="post" action="/api/admin/users" className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow">
        <input type="hidden" name="action" value="add" />
        <h2 className="text-lg font-bold">Add a user</h2>
        <input name="name" required placeholder="Full name" className={inp} />
        <input name="email" type="email" required autoCapitalize="none" placeholder="Email (they log in with this)" className={inp} />
        <input name="password" type="text" required minLength={8} autoComplete="off" placeholder="Password for them (min 8 characters)" className={inp} />
        <select name="role" defaultValue="editor" className={inp}>{ASSIGNABLE.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}</select>
        <button className="rounded-xl bg-brand p-3 font-extrabold text-white">Add user</button>
        <p className="text-xs text-[#667085]">Send them the password yourself (WhatsApp). They can log in at /admin with their email.</p>
      </form>

      <div className="mt-6 grid gap-3">
        {staff.length === 0 && <p className="text-[#667085]">No users yet.</p>}
        {staff.map((u) => (
          <article key={u.id} className={`rounded-2xl bg-white p-4 shadow ${u.active ? "" : "opacity-60"}`}>
            <p className="font-extrabold">{u.name} <span className="ml-1 rounded-full bg-[#eef2f6] px-2 py-0.5 text-xs font-bold">{ROLES[u.role]?.label.split(" (")[0] || u.role}</span>{!u.active && <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">Disabled</span>}</p>
            <p className="text-sm text-[#667085]">{u.email}{u.last_login ? ` · last login ${new Date(u.last_login).toLocaleDateString("en-US", { timeZone: "America/Santo_Domingo" })}` : " · never logged in"}</p>
            <form method="post" action="/api/admin/users" className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={u.id} />
              <select name="role" defaultValue={u.role} className="rounded-lg border border-[#d9dee5] bg-white p-2 text-sm">{ASSIGNABLE.map((r) => <option key={r} value={r}>{ROLES[r].label.split(" (")[0]}</option>)}</select>
              <button name="action" value="role" className="rounded-full bg-[#eef2f6] px-3 py-1.5 text-xs font-bold">Change role</button>
              <button name="action" value={u.active ? "disable" : "enable"} className="rounded-full bg-[#eef2f6] px-3 py-1.5 text-xs font-bold">{u.active ? "Disable" : "Enable"}</button>
              <input name="password" placeholder="New password" autoComplete="off" className="w-36 rounded-lg border border-[#d9dee5] p-2 text-sm" />
              <button name="action" value="password" className="rounded-full bg-[#eef2f6] px-3 py-1.5 text-xs font-bold">Reset password</button>
              <button name="action" value="delete" className="ml-auto text-xs font-bold text-red-600">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </main>
  );
}
