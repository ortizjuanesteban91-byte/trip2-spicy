"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send } from "lucide-react";
import { whatsapp } from "@/data/site";
import { PERSONAS } from "@/lib/personas";
const hello = (n) => `Hi, I'm ${n} from Trip2! What are you looking for: a tour, an excursion or a transfer? Tell me and we'll sort it out right here. I keep our conversation for 24 hours, so you can come back anytime and continue where we left off. ¡Hola! También hablo español.`;
const CHIPS = ["Book a tour", "What's popular?", "Reservar en español"];
const KEY = "t2chat";
const getSid = () => { try { let s = localStorage.getItem(KEY + "sid"); if (!s) { s = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(KEY + "sid", s); } return s; } catch { return ""; } };
const urlRe = /(https?:\/\/[^\s)]+[^\s).,;!?]|\/tour\/[a-z0-9-]+)/;
function Bubble({ m }) {
  const parts = m.content.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[*-]\s+/gm, "• ").split(urlRe); // show plain text, no stray asterisks
  return (
    <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${m.role === "user" ? "bg-brand text-white" : "bg-sky-50 text-ink"}`}>
        {parts.map((p, i) => i % 2 === 1
          ? <a key={i} href={p} target={p.includes("wa.me") ? "_blank" : undefined} rel="noopener" className={`block break-all rounded-xl px-3 py-2 text-center font-extrabold underline ${p.includes("stripe") ? "my-1 bg-amber-300 text-ink no-underline" : "text-brand"}`}>{p.includes("stripe") ? "Pay securely now →" : p.startsWith("/tour/") ? "See this tour →" : p}</a>
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
  const [pi, setPi] = useState(0);
  const [tip, setTip] = useState(false);
  useEffect(() => { let done = false; try { done = sessionStorage.getItem("t2tip") === "1"; } catch {} if (done) return; const a = setTimeout(() => setTip(true), 4000), b = setTimeout(() => setTip(false), 10000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  const hideTip = () => { setTip(false); try { sessionStorage.setItem("t2tip", "1"); } catch {} };
  const who = PERSONAS[pi] || PERSONAS[0];
  const end = useRef(null);
  useEffect(() => { try { let i = Number(localStorage.getItem(KEY + "p")); if (!Number.isInteger(i) || i < 0 || i >= PERSONAS.length || localStorage.getItem(KEY + "p") === null) { i = Math.floor(Math.random() * PERSONAS.length); localStorage.setItem(KEY + "p", String(i)); } setPi(i); } catch {} }, []);
  useEffect(() => { try { const o = JSON.parse(localStorage.getItem(KEY + "v2") || "null"); if (o && Date.now() - o.t < 864e5 && Array.isArray(o.m)) setMsgs(o.m); } catch {} }, []);
  useEffect(() => { try { if (msgs.length) localStorage.setItem(KEY + "v2", JSON.stringify({ t: Date.now(), m: msgs.slice(-30) })); } catch {} end.current?.scrollIntoView({ block: "end" }); }, [msgs, open, busy]);
  useEffect(() => { const f = () => setOpen(true); window.addEventListener("t2-chat-open", f); return () => window.removeEventListener("t2-chat-open", f); }, []);
  if (path.startsWith("/admin") || path.startsWith("/booking-")) return null;
  const onTour = path.startsWith("/tour/");
  async function send(t) {
    const content = String(t ?? text).trim();
    if (!content || busy) return;
    const next = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, persona: who.name, sid: getSid() }) });
      const j = await r.json().catch(() => ({}));
      setMsgs([...next, { role: "assistant", content: j.ok ? j.reply : `Sorry, I can't answer right now. Please message our team on WhatsApp: ${whatsapp}` }]);
    } catch { setMsgs([...next, { role: "assistant", content: `Connection problem. You can reach our team on WhatsApp: ${whatsapp}` }]); }
    setBusy(false);
  }
  return (
    <>
      {!open && tip && (
        <div className={`fixed right-3 z-[46] max-w-[200px] rounded-2xl bg-white p-3 pr-7 text-[13px] font-bold leading-snug text-ink shadow-xl ring-1 ring-sky-100 sm:right-4 ${onTour ? "bottom-[5.6rem] lg:bottom-20" : "bottom-20"}`}>
          <button onClick={hideTip} aria-label="Close" className="absolute right-1.5 top-1 text-base leading-none text-ink/40">×</button>
          <span className="block text-brand">Booking assistant</span>
          Ask me anything. I give exact prices and book your tour right here, no forms.
        </div>
      )}
      {!open && (
        <div className={`fixed right-3 z-[45] flex flex-col items-end gap-2 sm:right-4 ${onTour ? "max-lg:hidden bottom-5" : "bottom-5"}`}>
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand shadow ring-1 ring-sky-100">Ask me anything · I quote &amp; book for you</span>
          <button onClick={() => { hideTip(); setOpen(true); }} aria-label="Chat and book" className="flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-lg ring-2 ring-amber-300">
            <MessageCircle className="h-5 w-5" />Chat &amp; book
          </button>
        </div>
      )}
      {open && (
        <div role="dialog" aria-label="Trip2 booking assistant" className="fixed inset-x-0 bottom-0 z-[60] flex h-[min(86dvh,640px)] flex-col overflow-hidden rounded-t-3xl border border-sky-100 bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px] sm:rounded-3xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full text-base font-black text-white ring-2 ring-white/70" style={{ background: who.color }}>{who.name[0]}</span><div><p className="text-sm font-black">{who.name} · Trip2</p><p className="text-[11px] text-white/80">Virtual assistant · online now</p></div></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/15"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            <Bubble m={{ role: "assistant", content: hello(who.name) }} />
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
