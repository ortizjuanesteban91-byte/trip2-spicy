import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { getPost, sectionsToBody } from "@/lib/posts";
import AdminPhotos from "@/components/AdminPhotos";
export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post | Admin", robots: { index: false, follow: false } };
const inp = "w-full rounded-xl border border-[#d9dee5] bg-white p-3";
const F = ({ label, hint, children }) => <label className="grid gap-1 text-sm font-bold">{label}{hint && <span className="text-xs font-normal text-[#667085]">{hint}</span>}{children}</label>;
export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const { e } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "blog")) redirect(firstArea(session));
  const isNew = slug === "new";
  const p = isNew ? null : await getPost(slug, { fresh: true, includeHidden: true });
  if (!isNew && !p) redirect("/admin/blog");
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/admin/blog" className="text-sm font-bold text-brand">← All posts</Link>
      <h1 className="mt-2 text-2xl font-bold">{isNew ? "New blog post" : p.title}</h1>
      {e && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{e === "title" ? "Please enter a title." : "Could not save. Is Supabase connected?"}</p>}
      <form method="post" action="/api/admin/post" className="mt-6 grid gap-5">
        <input type="hidden" name="slug" value={p?.slug || ""} />
        <section className="grid gap-4 rounded-2xl bg-white p-5 shadow">
          <F label="Title"><input name="title" required defaultValue={p?.title || ""} className={inp} /></F>
          <F label="Short intro" hint="Shown at the top of the post and on the blog list. Blank line between paragraphs."><textarea name="intro" rows={4} defaultValue={(p?.intro || []).join("\n\n")} className={inp} /></F>
          <F label="Cover photo (optional)"><AdminPhotos name="image" max={1} initial={p?.image ? [p.image] : []} /></F>
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="visible" defaultChecked={!p?.hidden} className="h-5 w-5" /> Published (show on the website)</label>
        </section>
        <section className="grid gap-3 rounded-2xl bg-white p-5 shadow">
          <F label="Post text" hint="Write normally. Leave a blank line between paragraphs. Start a line with ## to make a heading (example: ## Best time to visit Saona)."><textarea name="body" rows={22} defaultValue={p ? sectionsToBody(p.sections) : ""} className={inp} /></F>
        </section>
        <details className="rounded-2xl bg-white p-5 shadow">
          <summary className="cursor-pointer text-lg font-bold">Google search description (optional)</summary>
          <div className="mt-4"><F label="Description (about 150 characters)" hint="Blank = made from the intro"><textarea name="meta" rows={3} defaultValue={p?.meta || ""} className={inp} /></F></div>
        </details>
        <div className="sticky bottom-3 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-lg">
          <button className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white">Save</button>
          {!isNew && <button name="action" value="delete" formNoValidate className="ml-auto text-sm font-bold text-red-600">{p.builtin ? "Hide from website" : "Delete post"}</button>}
        </div>
      </form>
    </main>
  );
}
