import { getSession, can, setStatus } from "@/lib/admin";
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "leads")) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  const f = await req.formData();
  await setStatus(f.get("id"), String(f.get("status")));
  return new Response(null, { status: 303, headers: { Location: "/admin" } });
}
