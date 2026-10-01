import Link from "next/link";
import { tours, tourHref } from "@/lib/content";
const aos = (i) => (i % 2 ? "zoom-out-left" : "zoom-out-right");
const ICONS = [
  [/pick-?up|drop-?off|round-?trip|transport|transfer/i, "🚐"],
  [/^(drive|bus ride|van ride|4x4 safari truck)/i, "🚌"],
  [/cancel/i, "✅"],
  [/snorkel|reef|coral/i, "🤿"],
  [/natural pool|sandbar|starfish/i, "🏝️"],
  [/open bar|rum|beer|drinks|cocktail/i, "🍹"],
  [/lunch|buffet|bbq|snack|breakfast|food|meal/i, "🍽️"],
  [/music|party|dj|dance/i, "🎶"],
  [/life vest|safety|briefing|harness|helmet|equipment/i, "🦺"],
  [/fish|angler|marlin|tuna|mahi|rod/i, "🎣"],
  [/whale/i, "🐋"],
  [/dolphin/i, "🐬"],
  [/monkey/i, "🐒"],
  [/horse/i, "🐴"],
  [/parasail|flight/i, "🪂"],
  [/zip/i, "🧗"],
  [/buggy/i, "🏎️"],
  [/\batv\b|utv|polaris|off-road|mud|trail/i, "🏍️"],
  [/speedboat|catamaran|boat|cruise|sail|bay\b|dock/i, "⛵"],
  [/waterfall|river|swim in/i, "💧"],
  [/cave|mangrove|park|taino|forest|jungle/i, "🌿"],
  [/summit|mountain|montaña|360|view|swing|panoram/i, "⛰️"],
  [/beach|white-sand|sand|swim|cayo|playa/i, "🏖️"],
  [/colonial|city|santo domingo|cathedral|historic|culture|higüey|basilica/i, "🏛️"],
  [/photo|camera|picture/i, "📸"],
  [/kids|child|famil|ages?\b|infant|couple/i, "👨‍👩‍👧"],
  [/bus|drive|truck|safari|ride to|van/i, "🚌"],
  [/minimum|group|private|shared/i, "👥"],
  [/\$|price|free\b/i, "💵"],
  [/hour|minute|duration|half day|full day|morning|afternoon|departure|am\b|pm\b/i, "⏱️"],
  [/return|back|arrive/i, "↩️"],
  [/sun|hat|sunscreen|sunglass/i, "🕶️"],
  [/towel|swimwear|swimsuit/i, "🩱"],
  [/cash|tip/i, "💵"],
];
const icon = (t) => (ICONS.find(([r]) => r.test(t)) || [0, "✔️"])[1];
const Circle = ({ children, cls = "bg-ice" }) => <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${cls}`}>{children}</span>;
const Check = ({ x }) => <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ${x ? "bg-rose-500" : "bg-brand"}`}>{x ? "✕" : "✓"}</span>;
const Card = ({ children, className = "" }) => <div className={`rounded-3xl border border-slate-200 bg-white p-5 ${className}`}>{children}</div>;
export default function Sections({ sections }) {
  return sections.map((s, i) => {
    const bring = /bring/i.test(s.h2);
    const inc = s.type === "inc";
    return (
    <section key={i} className="mt-10" data-aos={aos(i)}>
      {!inc && <h2 className="mb-4 text-2xl font-black text-ink">{s.h2}</h2>}
      {s.type === "text" && s.paras.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}
      {s.type === "list" && !bring && <div className="grid gap-3 sm:grid-cols-2">{s.items.map((x, k) => <div key={k} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4"><Circle>{icon(x)}</Circle><span className="text-sm leading-6 text-ink/80">{x}</span></div>)}</div>}
      {s.type === "list" && bring && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{s.items.map((x, k) => <div key={k} className="flex flex-col items-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 text-center"><span className="text-2xl">{icon(x) === "✔️" ? "🎒" : icon(x)}</span><span className="text-sm text-ink/80">{x}</span></div>)}</div>}
      {s.type === "steps" && <><p className="mb-4 text-sm text-ink/70">Here is how your day unfolds, step by step.</p><ol className="relative ml-5 border-l-2 border-sky-200 pl-8">{s.items.map((x, k) => <li key={k} className="relative pb-6 last:pb-0"><span className="absolute -left-[3.25rem] flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 bg-white text-lg">{icon(x)}</span><p className="text-[11px] font-extrabold tracking-widest text-brand/70">STEP {k + 1}</p><p className="mt-0.5 text-sm font-semibold leading-6 text-ink/85">{x}</p></li>)}</ol></>}
      {inc && <div className="space-y-4">{s.groups.map((g, k) => { const no = /not/i.test(g.label); return <Card key={k}><h3 className="mb-4 flex items-center gap-3 text-lg font-extrabold"><Check x={no} />{no ? "What's Not Included" : "What's Included"}</h3><ul className="space-y-3">{g.items.map((x, n) => <li key={n} className="flex gap-3 text-sm leading-6 text-ink/80"><span className={no ? "text-ink/50" : "text-emerald-600"}>{no ? "✕" : "✓"}</span><span>{x}</span></li>)}</ul></Card>; })}</div>}
      {s.type === "pc" && <div className="space-y-4">{s.groups.map((g, k) => { const con = /con/i.test(g.label); return <Card key={k}><h3 className="mb-4 text-lg font-extrabold">{g.label}</h3><ul className="space-y-3">{g.items.map((x, n) => <li key={n} className="flex gap-3 text-sm leading-6 text-ink/80"><Check x={con} /><span>{x}</span></li>)}</ul></Card>; })}</div>}
      {s.type === "faq" && <div className="space-y-2">{s.faq.map((f, k) => <details key={k} className="group rounded-2xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold">{f.q}</summary><p className="mt-2 text-sm leading-6 text-ink/75">{f.a}</p></details>)}</div>}
      {s.type === "links" && <div className="flex flex-wrap gap-2">{s.items.map((x, k) => { const t = tours.find((t) => t.name.toLowerCase().startsWith(x.toLowerCase().slice(0, 12)) || t.title.toLowerCase().startsWith(x.toLowerCase().slice(0, 12))); return t ? <Link key={k} href={tourHref(t.slug)} className="rounded-full bg-ice px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">{x}</Link> : <span key={k} className="rounded-full bg-ice px-4 py-2 text-sm">{x}</span>; })}</div>}
    </section>
  ); });
}
