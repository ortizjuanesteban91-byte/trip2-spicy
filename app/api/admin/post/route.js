import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/admin";
import { allPosts, savePost, deletePost } from "@/lib/posts";
const go = (p) => new Response(null, { status: 303, headers: { Location: p } });
const slugify = (n) => String(n).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
const t = (v, n) => String(v || "").trim().slice(0, n);
export async function POST(req) {
  const session = await getSession();
  if (!can(session, "blog")) return go("/admin");
  const f = await req.formData();
  const title = t(f.get("title"), 160);
  let slug = t(f.get("slug"), 90);
  const all = await allPosts({ includeHidden: true, fresh: true });
  const existing = all.find((p) => p.slug === slug);
  if (f.get("action") === "delete") {
    if (!existing) return go("/admin/blog");
    const ok = existing.builtin ? await savePost(slug, { hidden: true, data: {} }) : await deletePost(slug);
    revalidatePath("/", "layout");
    return go(ok ? "/admin/blog?saved=1" : `/admin/blog/${slug}?e=db`);
  }
  if (!title) return go(`/admin/blog/${slug || "new"}?e=title`);
  if (!slug) { slug = slugify(title) || `post-${Date.now()}`; const base = slug; let i = 2; while (all.some((p) => p.slug === slug)) slug = `${base}-${i++}`; }
  const image = t(f.get("image"), 600);
  const intro = t(f.get("intro"), 1200);
  const data = { by: session.name || "Owner", title, intro, meta: t(f.get("meta"), 200) || intro.slice(0, 155), ...(image ? { image } : {}), body: String(f.get("body") || "").slice(0, 60000) };
  const ok = await savePost(slug, { hidden: f.get("visible") !== "on", data });
  revalidatePath("/", "layout");
  return go(ok ? "/admin/blog?saved=1" : `/admin/blog/${slug}?e=db`);
}
