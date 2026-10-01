// Server-side price check for a booking, same rules as the booking box (never trust the browser's total).
// Rules: price per option (weekend price on Fri/Sat when set), Mondays closed when tour.closedDays says so, minimum 2 people when tour.min2.
export function quote(tour, { date, qty = {} }) {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? new Date(`${date}T12:00:00`) : null;
  if (!d || isNaN(d)) return { ok: false, error: "date" };
  const dow = d.getDay();
  if ((tour.closedDays || []).includes(dow)) return { ok: false, error: "closed" };
  const lines = (tour.options || []).map((o, i) => {
    const n = Math.max(0, Math.min(20, Math.floor(Number(qty[i]) || 0)));
    const price = o.priceWknd && (dow === 5 || dow === 6) ? o.priceWknd : o.price;
    return { label: o.label, qty: n, price, people: o.people || 1 };
  }).filter((l) => l.qty > 0);
  if (!lines.length) return { ok: false, error: "empty" };
  const people = lines.reduce((a, l) => a + l.qty * l.people, 0);
  if (tour.min2 && people < 2) return { ok: false, error: "min2" };
  const total = Math.round(lines.reduce((a, l) => a + l.qty * l.price, 0) * 100) / 100;
  return { ok: true, lines, people, total };
}
