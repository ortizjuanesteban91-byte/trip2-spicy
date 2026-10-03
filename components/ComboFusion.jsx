// Combo card picture: 2 or 3 tour photos fused with diagonal cuts, gold dividers, "+" badges and a COMBO tag.
const S = 7; // slant (% of card width)
export default function ComboFusion({ urls = [], name = "" }) {
  const n = urls.length;
  const edge = (i) => (i <= 0 ? [0, 0] : i >= n ? [100, 100] : [(i * 100) / n + S, (i * 100) / n - S]); // [x at top, x at bottom]
  return (
    <div className="group absolute inset-0 overflow-hidden bg-[#0b2a33]">
      {urls.map((u, i) => {
        const [lt, lb] = edge(i), [rt, rb] = edge(i + 1);
        return <img key={i} src={u} alt={i ? "" : name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" style={{ clipPath: `polygon(${lt}% 0, ${rt}% 0, ${rb}% 100%, ${lb}% 100%)` }} />;
      })}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: n - 1 }, (_, j) => { const [t, b] = edge(j + 1); return <line key={j} x1={t} y1="0" x2={b} y2="100" stroke="#dcb14e" strokeWidth="3" vectorEffect="non-scaling-stroke" />; })}
      </svg>
      {Array.from({ length: n - 1 }, (_, j) => (
        <span key={j} aria-hidden="true" className="pointer-events-none absolute top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-lg font-black leading-none text-[#10222b] shadow-[0_0_0_3px_rgba(255,255,255,.9),0_4px_14px_rgba(0,0,0,.4)]" style={{ left: `${((j + 1) * 100) / n}%` }}>+</span>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[11px] font-black tracking-wide text-[#10222b] shadow-lg">⚡ COMBO · {n} IN 1</span>
    </div>
  );
}
