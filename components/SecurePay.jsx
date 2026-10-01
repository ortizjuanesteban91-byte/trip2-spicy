// Trust badges shown around payment. Simple text badges (no brand logo files).
const B = ({ children, c = "" }) => <span className={`rounded-md border px-2 py-1 text-[11px] leading-none font-extrabold ${c}`}>{children}</span>;

export default function SecurePay({ dark = false }) {
  const line = dark ? "text-sky-100" : "text-ink/70";
  const bd = dark ? "border-white/25 bg-white/10 text-white" : "border-sky-200 bg-white text-ink";
  return (
    <div className="text-center">
      <p className={`flex items-center justify-center gap-1.5 text-xs font-bold ${line}`}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        Secure, encrypted payment
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        <B c={dark ? bd : "border-[#635bff]/40 bg-[#635bff]/10 text-[#4b43d6]"}>stripe</B>
        <B c={dark ? bd : `${bd} italic text-[#1a1f71]`}>VISA</B>
        <B c={bd}><span className="text-[#eb001b]">●</span><span className="-ml-1 text-[#f79e1b]">●</span> Mastercard</B>
        <B c={bd}>Amex</B>
      </div>
    </div>
  );
}
