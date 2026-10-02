"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send } from "lucide-react";
import { whatsapp } from "@/data/site";
const HELLO = "Hi! I'm Trip2's virtual assistant. Ask me anything about our tours, or tell me what you'd like to book and I'll do it with you right here. ¡Hola! También hablo español.";
const CHIPS = ["Book a tour", "What's popular?", "Reservar en español"];
const KEY = "t2chat";
const urlRe = /(https?:\/\/[^\s)]+[^\s).,;!?])/;
function Bubble({ m }) {
  const parts = m.content.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[*-]\s+/gm, "• ").split(urlRe); // show plain text, no stray asterisks
  return (
    <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${m.role === "user" ? "bg-brand text-white" : "bg-sky-50 text-ink"}`}>
        {parts.map((p, i) => i % 2 === 1
          ? <a key={i} href={p} target={p.includes("wa.me") ? "_blank" : undefined} rel="noopener" className={`block break-all rounded-xl px-3 py-2 text-center font-extrabold underline ${p.includes("stripe") ? "my-1 bg-amber-300 text-ink no-underline" : "text-brand"}`}>{p.includes("stripe") ? "Pay securely now →" : p}</a>
          : <span key={i}>{p}</span>)}
      </div>
    </div>
  );
}
export default function ChatWidget() {
  const path = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { try { const s = JSON.parse(sessionStorage.getItem(KEY) || "[]"); if (Array.isArray(s)) setMsgs(s); } catch {} }, []);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30))); } catch {} end.current?.scrollIntoView({ block: "end" }); }, [msgs, open, busy]);
  if (path.startsWith("/admin") || path.startsWith("/booking-")) return null;
  const onTour = path.startsWith("/tour/");
  async function send(t) {
    const content = String(t ?? text).trim();
    if (!content || busy) return;
    const next = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const j = await r.json().catch(() => ({}));
      setMsgs([...next, { role: "assistant", content: j.ok ? j.reply : `Sorry, I can't answer right now. Please message our team on WhatsApp: ${whatsapp}` }]);
    } catch { setMsgs([...next, { role: "assistant", content: `Connection problem. You can reach our team on WhatsApp: ${whatsapp}` }]); }
    setBusy(false);
  }
  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Chat and book" className={`fixed right-4 z-[45] flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-xl ring-2 ring-amber-300 ${onTour ? "bottom-24 lg:bottom-5" : "bottom-5"}`}>
          <MessageCircle className="h-5 w-5" /> Chat &amp; book
        </button>
      )}
      {open && (
        <div role="dialog" aria-label="Trip2 booking assistant" className="fixed inset-x-0 bottom-0 z-[60] flex h-[min(86dvh,640px)] flex-col overflow-hidden rounded-t-3xl border border-sky-100 bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px] sm:rounded-3xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div><p className="text-sm font-black">Trip2 Booking Assistant</p><p className="text-[11px] text-white/80">Ask questions or book in minutes</p></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/15"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            <Bubble m={{ role: "assistant", content: HELLO }} />
            {!msgs.length && <div className="flex flex-wrap gap-2 pt-1">{CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-brand">{c}</button>)}</div>}
            {msgs.map((m, i) => <Bubble key={i} m={m} />)}
            {busy && <div className="flex"><div className="rounded-2xl bg-sky-50 px-3.5 py-2.5 text-sm text-ink/60">Typing…</div></div>}
            <div ref={end} />
          </div>
          <p className="border-t border-sky-100 px-3 pt-2 text-center text-[10px] text-ink/50">🔒 Never type card numbers here. Payment is on Stripe's secure page.</p>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 p-3 pt-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message…" maxLength={500} className="min-w-0 flex-1 rounded-full border border-sky-200 bg-sky-50/70 px-4 py-3 text-[15px] text-ink" />
            <button disabled={busy || !text.trim()} aria-label="Send" className="rounded-full bg-brand p-3 text-white disabled:bg-slate-300"><Send className="h-5 w-5" /></button>
          </form>
          <a href={whatsapp} target="_blank" rel="noopener" className="border-t border-sky-100 py-2 text-center text-xs font-bold text-brand">Prefer a person? Chat on WhatsApp</a>
        </div>
      )}
    </>
  );
}
