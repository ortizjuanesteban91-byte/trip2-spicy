"use client";
import { useState } from "react";
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
// fields: [{name,label,type:'text'|'select'|'radio'|'textarea',options?,required?}]
export default function LeadForm({ kind, intro, fields }) {
  const [state, setState] = useState("idle");
  async function submit(e) {
    e.preventDefault();
    setState("sending");
    const f = Object.fromEntries(new FormData(e.target));
    const { first, last, email, phone, website, message, ...details } = f;
    const body = { kind, name: `${first || ""} ${last || ""}`.trim(), email, phone, message, website, details, budget: details["Budget Range"] || "" };
    try {
      const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="rounded-xl bg-white p-6 font-bold text-brand">Thank you! Our concierge will contact you shortly on WhatsApp or email.</p>;
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 shadow">
      {intro && <p className="text-[#667085]">{intro}</p>}
      <div className="grid grid-cols-2 gap-3">
        <input name="first" required placeholder="First name *" className={inp} />
        <input name="last" required placeholder="Last name *" className={inp} />
      </div>
      <input name="email" type="email" required placeholder="Email *" className={inp} />
      <input name="phone" required placeholder="Phone *" className={inp} />
      {fields.map((f) => (
        <label key={f.name} className="grid gap-1 text-sm font-bold">
          {f.label}{f.required ? " *" : ""}
          {f.type === "select" ? (
            <select name={f.name} required={f.required} className={inp} defaultValue="">
              <option value="" disabled>Select</option>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === "radio" ? (
            <span className="flex flex-wrap gap-2 font-normal">
              {f.options.map((o, i) => (
                <label key={o} className="flex items-center gap-2 rounded-lg border border-[#d9dee5] px-3 py-2">
                  <input type="radio" name={f.name} value={o} required={f.required && i === 0} />{o}
                </label>
              ))}
            </span>
          ) : f.type === "textarea" ? (
            <textarea name={f.name} rows={4} defaultValue={f.defaultValue} className={inp} />
          ) : (
            <input name={f.name} defaultValue={f.defaultValue} required={f.required} className={inp} />
          )}
        </label>
      ))}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <button disabled={state === "sending"} className="rounded-xl bg-brand p-3 font-extrabold text-white hover:bg-brand-hover">{state === "sending" ? "Sending..." : "Send"}</button>
      {state === "error" && <p className="text-red-600">Could not send. Please message us on WhatsApp.</p>}
    </form>
  );
}
