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

// Card marks drawn as inline SVG (crisp at any size, no image files).
const Visa = () => <svg viewBox="0 0 48 30" width="46" height="29" role="img" aria-label="Visa"><rect width="48" height="30" rx="4" fill="#fff" stroke="#d0d5dd" /><text x="24" y="21" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontStyle="italic" fontSize="16" fill="#1a1f71">VISA</text></svg>;
const MC = () => <svg viewBox="0 0 48 30" width="46" height="29" role="img" aria-label="Mastercard"><rect width="48" height="30" rx="4" fill="#fff" stroke="#d0d5dd" /><circle cx="19" cy="15" r="8" fill="#eb001b" /><circle cx="29" cy="15" r="8" fill="#f79e1b" /><path d="M24 8.6a8 8 0 0 1 0 12.8 8 8 0 0 1 0-12.8z" fill="#ff5f00" /></svg>;
const Amex = () => <svg viewBox="0 0 48 30" width="46" height="29" role="img" aria-label="American Express"><rect width="48" height="30" rx="4" fill="#006fcf" /><text x="24" y="19" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="9.5" fill="#fff">AMEX</text></svg>;
const Stripe = () => <svg viewBox="0 0 60 30" width="58" height="29" role="img" aria-label="Powered by Stripe"><rect width="60" height="30" rx="4" fill="#635bff" /><text x="30" y="20" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="#fff">stripe</text></svg>;
export function TrustTop() {
  return (
    <div className="mt-3 grid gap-2">
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[13px] font-extrabold text-emerald-800 ring-1 ring-emerald-200">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path d="M8.5 12l2.5 2.5L15.5 10" /></svg>
        Free cancellation up to 24 hours before
      </div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white px-3 py-2 ring-1 ring-sky-200">
        <span className="mr-1 flex items-center gap-1 text-[12px] font-extrabold text-ink/80"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Secure payment</span>
        <Visa /><MC /><Amex /><Stripe />
      </div>
    </div>
  );
}
