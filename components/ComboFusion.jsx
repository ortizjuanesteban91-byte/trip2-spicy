// Combo card picture: 2 or 3 tour photos fused with diagonal cuts, thin white dividers and a white COMBO tag.
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
        {Array.from({ length: n - 1 }, (_, j) => { const [t, b] = edge(j + 1); return <line key={j} x1={t} y1="0" x2={b} y2="100" stroke="#ffffff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />; })}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold tracking-wide text-ink shadow-lg">⚡ COMBO · {n} IN 1</span>
    </div>
  );
}
