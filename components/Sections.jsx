import Link from "next/link";
import { TextIcon } from "@/components/Icon";
import { Check as CheckIcon, X as XIcon } from "lucide-react";
import { tours, tourHref } from "@/lib/content";
const aos = (i) => (i % 2 ? "zoom-out-left" : "zoom-out-right");
const Circle = ({ children, cls = "bg-ice text-brand" }) => <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cls}`}>{children}</span>;
const Check = ({ x }) => <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${x ? "bg-rose-500" : "bg-brand"}`}>{x ? <XIcon className="h-3 w-3" strokeWidth={3} /> : <CheckIcon className="h-3 w-3" strokeWidth={3} />}</span>;
const Card = ({ children, className = "" }) => <div className={`rounded-3xl border border-slate-200 bg-white p-5 ${className}`}>{children}</div>;
export default function Sections({ sections }) {
  return sections.map((s, i) => {
    const bring = /bring/i.test(s.h2);
    const inc = s.type === "inc";
    return (
    <section key={i} className="mt-10" data-aos={aos(i)}>
      {!inc && s.type !== "pc" && <h2 className="mb-4 text-2xl font-black text-ink">{s.h2}</h2>}
      {s.type === "text" && s.paras.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}
      {s.type === "list" && !bring && <div className="grid gap-3 sm:grid-cols-2">{s.items.map((x, k) => <div key={k} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4"><Circle><TextIcon text={x} /></Circle><span className="text-sm leading-6 text-ink/80">{x}</span></div>)}</div>}
      {s.type === "list" && bring && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{s.items.map((x, k) => <div key={k} className="flex flex-col items-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 text-center"><span className="text-brand"><TextIcon text={x} className="h-7 w-7" /></span><span className="text-sm text-ink/80">{x}</span></div>)}</div>}
      {s.type === "steps" && <><p className="mb-4 text-sm text-ink/70">Here is how your day unfolds, step by step.</p><ol className="relative ml-5 border-l-2 border-sky-200 pl-8">{s.items.map((x, k) => <li key={k} className="relative pb-6 last:pb-0"><span className="absolute -left-[3.25rem] flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 bg-white text-brand"><TextIcon text={x} /></span><p className="text-[11px] font-extrabold tracking-widest text-brand/70">STEP {k + 1}</p><p className="mt-0.5 text-sm font-semibold leading-6 text-ink/85">{x}</p></li>)}</ol></>}
      {inc && <div className="space-y-4">{s.groups.map((g, k) => { const no = /not/i.test(g.label); return <Card key={k}><h3 className="mb-4 flex items-center gap-3 text-lg font-extrabold"><Check x={no} />{no ? "What's Not Included" : "What's Included"}</h3><ul className="space-y-3">{g.items.map((x, n) => <li key={n} className="flex gap-3 text-sm leading-6 text-ink/80"><span className={no ? "text-ink/50" : "text-emerald-600"}>{no ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}</span><span>{x}</span></li>)}</ul></Card>; })}</div>}
      {s.type === "pc" && <div className="space-y-8">{s.groups.map((g, k) => { const con = /con/i.test(g.label); return <div key={k}><h2 className="mb-4 text-2xl font-black text-ink">{con ? "Cons" : "Pros"}</h2><Card><ul className="space-y-3">{g.items.map((x, n) => <li key={n} className="flex gap-3 text-sm leading-6 text-ink/80"><Check x={con} /><span>{x}</span></li>)}</ul></Card></div>; })}</div>}
      {s.type === "faq" && <div className="space-y-2">{s.faq.map((f, k) => <details key={k} className="group rounded-2xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold">{f.q}</summary><p className="mt-2 text-sm leading-6 text-ink/75">{f.a}</p></details>)}</div>}
      {s.type === "links" && <div className="flex flex-wrap gap-2">{s.items.map((x, k) => { const t = tours.find((t) => t.name.toLowerCase().startsWith(x.toLowerCase().slice(0, 12)) || t.title.toLowerCase().startsWith(x.toLowerCase().slice(0, 12))); return t ? <Link key={k} href={tourHref(t.slug)} className="rounded-full bg-ice px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">{x}</Link> : <span key={k} className="rounded-full bg-ice px-4 py-2 text-sm">{x}</span>; })}</div>}
    </section>
  ); });
}
