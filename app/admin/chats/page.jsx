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
  const ev = await listSettings("evidence:", 60);
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-extrabold">Chat conversations</h1>
      <p className="mt-1 text-sm text-[#667085]">What guests say to the booking assistant. Newest first. Lines starting with [ERROR] mean the assistant failed.</p>
      {ev.length > 0 && (
        <section className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-extrabold text-red-800">Flagged messages (evidence)</h2>
          <p className="mt-1 text-xs text-red-900/80">Sexual or violent language. Each record keeps the time, IP, browser and the whole conversation. 3 strikes, or any threat, blocks the chat for 30 days.</p>
          <div className="mt-3 grid gap-3">
            {ev.map((r) => (
              <details key={r.key} className="rounded-xl bg-white p-3 shadow-sm">
                <summary className="cursor-pointer text-sm font-bold">{new Date(r.data?.at || r.updated_at).toLocaleString("en-US", { timeZone: "America/Santo_Domingo" })} · {r.data?.category} · strike {r.data?.strikes}{r.data?.blocked ? " · BLOCKED" : ""} · IP {r.data?.ip}</summary>
                <p className="mt-2 text-xs text-[#667085]">Browser: {r.data?.ua}</p>
                <p className="mt-2 rounded-lg bg-red-100 px-3 py-2 text-sm"><b>Flagged:</b> {r.data?.flagged}</p>
                <div className="mt-2 grid gap-1.5 text-xs">{(r.data?.msgs || []).map((m, i) => <p key={i} className={`whitespace-pre-wrap rounded-lg px-2.5 py-1.5 ${m.role === "user" ? "bg-sky-50" : "bg-[#f4f7fc]"}`}><b>{m.role === "user" ? "Guest" : "Bot"}:</b> {m.content}</p>)}</div>
              </details>
            ))}
          </div>
        </section>
      )}
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
