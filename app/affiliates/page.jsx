import { METHODS } from "@/lib/affiliates";
export const metadata = { title: "Affiliate program | Trip2 Punta Cana", description: "Earn a commission for every guest you send to Trip2 Punta Cana. Paid weekly.", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const MSG = { form: "Please fill every field (password at least 8 characters).", exists: "This email is already registered. Log in below.", slow: "Too many attempts. Try again later.", db: "Could not save. Please try again.", login: "Wrong email or password.", pending: "Your account is waiting for approval. We will email you.", disabled: "This account is disabled. Contact us." };
export default async function Page({ searchParams }) {
  const { ok, e } = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-extrabold tracking-widest text-brand">AFFILIATE PROGRAM</p>
      <h1 className="mt-1 text-4xl font-extrabold">Earn money sending guests to Trip2</h1>
      <p className="mt-3 text-lg text-[#475467]">Share your personal link. When your guest books and takes the tour, you earn a commission. We pay every week.</p>
      <ol className="mt-6 grid gap-2 text-[#344054]"><li>1. Register below with your payout details.</li><li>2. We approve you and you get your personal link.</li><li>3. Guests book through your link (tracked for 30 days).</li><li>4. After the tour is completed, the commission is yours. Paid weekly by bank transfer, PayPal or Zelle.</li></ol>
      {ok && <p className="mt-6 rounded-xl bg-emerald-50 p-4 font-bold text-emerald-800">Thank you! We received your registration. We will review it and email you once approved.</p>}
      {e && MSG[e] && <p className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-900">{MSG[e]}</p>}
      <section id="signup" className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-extrabold">Register</h2>
        <form method="post" action="/api/affiliate/signup" className="mt-4 grid gap-3">
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <input name="name" required placeholder="Full name or company" className={inp} />
          <input name="email" type="email" required placeholder="Email" className={inp} />
          <input name="phone" required placeholder="Phone / WhatsApp" className={inp} />
          <input name="country" placeholder="Country" className={inp} />
          <select name="method" required defaultValue="" className={inp}><option value="" disabled>How do you want to be paid?</option>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
          <textarea name="payout" required rows={3} placeholder="Payout details (bank name and account, PayPal email, or Zelle email/phone)" className={inp} />
          <input name="password" type="password" minLength={8} required placeholder="Choose a password (8+ characters)" className={inp} />
          <button className="rounded-xl bg-brand p-4 font-extrabold text-white">Register as affiliate</button>
        </form>
      </section>
      <section id="login" className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-extrabold">Already an affiliate? Log in</h2>
        <form method="post" action="/api/affiliate/login" className="mt-4 grid gap-3">
          <input name="email" type="email" required placeholder="Email" className={inp} />
          <input name="password" type="password" required placeholder="Password" className={inp} />
          <button className="rounded-xl bg-[#0d1626] p-4 font-extrabold text-white">Log in</button>
        </form>
      </section>
    </main>
  );
}
