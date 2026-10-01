import Link from "next/link";
import { tours, tourHref } from "@/lib/content";
const aos = (i) => (i % 2 ? "zoom-out-left" : "zoom-out-right");
const Li = ({ children }) => <li className="flex gap-2 text-sm leading-6 text-ink/80"><span className="mt-1 text-brand">✓</span><span>{children}</span></li>;
export default function Sections({ sections }) {
  return sections.map((s, i) => (
    <section key={i} className="mt-10" data-aos={aos(i)}>
      <h2 className="mb-3 text-2xl font-black text-brand">{s.h2}</h2>
      {s.type === "text" && s.paras.map((p, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{p}</p>)}
      {s.type === "list" && <ul className="grid gap-2 sm:grid-cols-2">{s.items.map((x, k) => <Li key={k}>{x}</Li>)}</ul>}
      {s.type === "steps" && <ol className="space-y-2">{s.items.map((x, k) => <li key={k} className="flex gap-3 rounded-xl bg-ice p-3 text-sm"><b className="text-brand">{k + 1}</b><span>{x}</span></li>)}</ol>}
      {(s.type === "inc" || s.type === "pc") && <div className="grid gap-4 sm:grid-cols-2">{s.groups.map((g, k) => <div key={k} className="rounded-2xl bg-white p-5 shadow ring-1 ring-sky-100"><h3 className="mb-2 font-extrabold">{g.label}</h3><ul className="space-y-1.5">{g.items.map((x, n) => <li key={n} className="flex gap-2 text-sm leading-6 text-ink/80"><span className={/not|con/i.test(g.label) ? "text-rose-500" : "text-brand"}>{/not|con/i.test(g.label) ? "✕" : "✓"}</span><span>{x}</span></li>)}</ul></div>)}</div>}
      {s.type === "faq" && <div className="space-y-2">{s.faq.map((f, k) => <details key={k} className="group rounded-xl bg-white p-4 shadow ring-1 ring-sky-100"><summary className="cursor-pointer font-bold">{f.q}</summary><p className="mt-2 text-sm leading-6 text-ink/75">{f.a}</p></details>)}</div>}
      {s.type === "links" && <div className="flex flex-wrap gap-2">{s.items.map((x, k) => { const t = tours.find((t) => t.name.toLowerCase().startsWith(x.toLowerCase().slice(0, 12)) || t.title.toLowerCase().startsWith(x.toLowerCase().slice(0, 12))); return t ? <Link key={k} href={tourHref(t.slug)} className="rounded-full bg-ice px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">{x}</Link> : <span key={k} className="rounded-full bg-ice px-4 py-2 text-sm">{x}</span>; })}</div>}
    </section>
  ));
}
