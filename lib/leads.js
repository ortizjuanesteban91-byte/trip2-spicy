// Saves a lead to Supabase (REST) using server-only keys. No extra packages needed.
export async function saveLead(lead) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { ok: false, reason: "not-configured" };
  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(lead),
  });
  return { ok: res.ok, reason: res.ok ? "" : `db-${res.status}` };
}
