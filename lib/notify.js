// Email alert to the agency when a lead arrives. Two ways, both free, both off until set in Vercel:
//  1) The existing mailbox (DreamHost): SMTP_USER (e.g. Contact@trip2puntacana.com) + SMTP_PASS. SMTP_HOST defaults to smtp.dreamhost.com, port 587.
//  2) Resend (3,000 emails/month): RESEND_API_KEY (needs DNS records added to the domain).
// Optional: LEAD_ALERT_TO (default: the site email from Settings), LEAD_ALERT_FROM.
import nodemailer from "nodemailer";
import { getSite } from "./siteconf";
const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KIND = { booking: "Booking", contact: "Contact message", enquiry: "Tour enquiry", transfer: "Airport transfer", affiliate: "Affiliate signup" };
export async function sendLeadAlert(lead) {
  const key = process.env.RESEND_API_KEY;
  const smtp = process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!key && !smtp) return false;
  try {
    const site = await getSite();
    const to = (process.env.LEAD_ALERT_TO || site.email || "").split(",").map((x) => x.trim()).filter(Boolean);
    if (!to.length) return false;
    const rows = [["Type", KIND[lead.kind] || lead.kind], ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone], ["Language", lead.lang], ["Message", lead.message], ...Object.entries(lead.details || {}).filter(([k]) => k !== "Photos")];
    const photos = String(lead.details?.Photos || "").split(/\s+/).filter((u) => /^https:\/\//.test(u));
    const html = `<h2 style="margin:0 0 12px">New lead: ${esc(lead.name)}</h2><table cellpadding="6" style="border-collapse:collapse;font:14px Arial">${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="color:#667085;vertical-align:top">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("")}</table>${photos.length ? `<p>Photos:<br>${photos.map((u) => `<a href="${esc(u)}">${esc(u)}</a>`).join("<br>")}</p>` : ""}<p style="margin-top:16px"><a href="https://trip2-spicy.vercel.app/admin">Open the back end</a></p>`;
    const subject = `New ${KIND[lead.kind] || "lead"}: ${lead.name}`;
    if (smtp) {
      const tx = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.dreamhost.com", port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await tx.sendMail({ from: process.env.LEAD_ALERT_FROM || `Trip2 Spicy <${process.env.SMTP_USER}>`, to, ...(lead.email ? { replyTo: lead.email } : {}), subject, html });
      return true;
    }
    const r = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.LEAD_ALERT_FROM || "Trip2 Spicy <bookings@trip2puntacana.com>", to, ...(lead.email ? { reply_to: lead.email } : {}), subject, html }),
    });
    return r.ok;
  } catch { return false; }
}
