import Link from "next/link";
import { posts, grad } from "@/lib/content";
import { SITE } from "@/lib/site";
export const metadata = { title: "Punta Cana Travel Blog | Trip2", description: "Guides and tips for choosing the best Punta Cana excursions.", alternates: { canonical: `${SITE}/blog/` } };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-center text-4xl font-black text-brand" data-aos="zoom-in">Blogs</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <article key={p.slug} className="relative cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-2xl bg-white shadow ring-1 ring-sky-100" data-aos="zoom-in">
            <div className={`h-40 bg-gradient-to-br ${grad(i)}`} />
            <div className="p-5"><h2 className="text-lg font-extrabold leading-snug">{p.h1}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70">{p.meta}</p><Link href={`/blog/${p.slug}`} className="mt-3 inline-block text-sm font-bold text-brand after:absolute after:inset-0 after:content-['']">Read guide →</Link></div>
          </article>
        ))}
      </div>
    </main>
  );
}
