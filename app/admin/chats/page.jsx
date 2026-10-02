import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { listSettings } from "@/lib/siteconf";
export const dynamic = "force-dynamic";
export const metadata = { title: "Chats | Admin", robots: { index: false, follow: false } };
export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "leads")) redirect(firstArea(session));
  const rows = await listSettings("chat:", 60);
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-extrabold">Chat conversations</h1>
      <p className="mt-1 text-sm text-[#667085]">What guests say to the booking assistant. Newest first. Lines starting with [ERROR] mean the assistant failed.</p>
      {!rows.length && <p className="mt-6 rounded-xl bg-white p-5 text-sm shadow">No chats saved yet. They appear here after the first conversation.</p>}
      <div className="mt-6 grid gap-4">
        {rows.map((r) => (
          <details key={r.key} className="rounded-2xl bg-white p-4 shadow">
            <summary className="cursor-pointer text-sm font-extrabold">{new Date(r.updated_at).toLocaleString("en-US", { timeZone: "America/Santo_Domingo" })} · {(r.data?.msgs || []).filter((m) => m.role === "user").length} guest messages · first: {(r.data?.msgs || []).find((m) => m.role === "user")?.content?.slice(0, 50)}</summary>
            <div className="mt-3 grid gap-2 text-sm">
              {(r.data?.msgs || []).map((m, i) => <p key={i} className={`whitespace-pre-wrap rounded-xl px-3 py-2 ${m.role === "user" ? "bg-sky-50 text-right" : "bg-[#f4f7fc]"}`}><b>{m.role === "user" ? "Guest" : r.data?.persona || "Bot"}:</b> {m.content}</p>)}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
