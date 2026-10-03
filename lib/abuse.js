// Abuse protection for the chat bot: sexual / violent / threatening messages.
// Strike 1 = polite refusal, strike 2 = final warning, strike 3 (or any severe threat) = chat blocked for 30 days for that visitor (IP).
// Every strike keeps EVIDENCE (time, IP, browser, flagged message, full conversation) in Supabase `settings` under evidence:*, shown in /admin/chats.
import { getSetting, saveSetting } from "@/lib/siteconf";
const SEVERE = /\b(rape|raping|rapist|molest\w*|kill (you|u|her|him|them|everyone)|i('| wi)ll (kill|hurt|find|beat) (you|u)|bomb|shoot you|violar|violaci[oó]n|te voy a (matar|violar|buscar)|los voy a matar|matarte)\b|\b(child|kid|minor|underage|menor|ni[ñn][oa]s?)\b.{0,40}\b(sex|sexo|nude|desnud\w*|naked)\b/i;
const SEXUAL = /\b(sex|sexo|sexual|fuck\w*|nudes?|naked|desnud[oa]s?|porn\w*|horny|cachond[oa]s?|pussy|dick|cock|tits|boobs|blowjob|masturb\w*|prostitut[ao]s?|hooker|puta|putas|follar|verga|culo|nalgas|chingar|webo|pene|vagina|threesome|trio sexual)\b/i;
export const detect = (text) => (SEVERE.test(text) ? "severe" : SEXUAL.test(text) ? "sexual" : null);
const key = (s) => String(s || "x").replace(/[^a-z0-9.:]/gi, "").slice(0, 60) || "x";
const DAY = 864e5;
export async function isBlocked(ip) {
  const b = await getSetting(`block:${key(ip)}`, true);
  return !!(b && b.until && new Date(b.until) > new Date());
}
export const BLOCKED_MSG = (wa) => `This chat is no longer available because earlier messages broke our respectful-use rules. If you need help with a booking, please contact our team on WhatsApp: ${wa}`;
export async function strike({ ip, sid, ua, category, text, msgs }) {
  const k = key(ip);
  const rec = (await getSetting(`abuse:${k}`, true)) || { strikes: 0, events: [] };
  const strikes = rec.strikes + 1;
  const at = new Date().toISOString();
  const events = [...rec.events, { at, category, text: String(text).slice(0, 400) }].slice(-20);
  const block = category === "severe" || strikes >= 3;
  await saveSetting(`abuse:${k}`, { strikes, events, ip, ua: String(ua || "").slice(0, 200), last: at });
  // Evidence record (what the guest wrote, when, from where, and the whole conversation).
  await saveSetting(`evidence:${at.replace(/[^0-9]/g, "")}-${key(sid)}`, { at, ip, ua: String(ua || "").slice(0, 200), sid: key(sid), category, strikes, blocked: block, flagged: String(text).slice(0, 600), msgs: (msgs || []).slice(-30).map((m) => ({ role: m.role, content: String(m.content).slice(0, 800) })) });
  if (block) await saveSetting(`block:${k}`, { until: new Date(Date.now() + 30 * DAY).toISOString(), at, category, ip });
  return { strikes, block };
}
export const replyFor = ({ strikes, block }, wa) =>
  block ? BLOCKED_MSG(wa)
  : strikes === 1 ? "I'm afraid that's not something we can help with. Trip2 offers tours and excursions in Punta Cana, and I'd be glad to help you find one. Please keep our conversation respectful."
  : `This is a final warning: language like this is recorded and, if it continues, this chat will be blocked. If you'd like help with a tour, I'm happy to assist. Our team is also on WhatsApp: ${wa}`;
