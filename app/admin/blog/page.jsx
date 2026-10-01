import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, can, firstArea } from "@/lib/admin";
import { allPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export const metadata = { title: "Blog | Admin", robots: { index: false, follow: false } };
export default async function Page({ searchParams }) {
  const { saved } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/admin");
  if (!can(session, "blog")) redirect(firstArea(session));
  const list = await allPosts({ includeHidden: true, fresh: true });
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Blog posts ({list.length})</h1>
        <Link href="/admin/blog/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white">+ New post</Link>
      </div>
      {saved && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Saved. The website updates within a minute.</p>}
      <div className="mt-6 grid gap-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/admin/blog/${p.slug}`} className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow ${p.hidden ? "opacity-60" : ""}`}>
            <span className="flex-1"><b className="block">{p.title}</b><span className="text-sm text-[#667085]">/blog/{p.slug}{p.by ? ` · edited by ${p.by}` : ""}</span></span>
            {p.hidden && <span className="rounded-full bg-[#eef2f6] px-2 py-1 text-xs font-bold">Hidden</span>}
            <span className="text-sm font-bold text-brand">Edit</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
