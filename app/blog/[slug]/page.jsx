import { OG_IMAGE } from "@/lib/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts as basePosts, grad } from "@/lib/content";
import { getPost } from "@/lib/posts";
import { SITE } from "@/lib/site";
import Sections from "@/components/Sections";
export const revalidate = 60;
export function generateStaticParams() { return basePosts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }) {
  const p = await getPost((await params).slug);
  if (!p) return {};
  const url = `${SITE}/blog/${p.slug}/`;
  return { title: p.metaTitle, description: p.meta, alternates: { canonical: url }, openGraph: { title: p.metaTitle, description: p.meta, url, type: "article", images: [OG_IMAGE] } };
}
export default async function Post({ params }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.h1, description: p.meta, mainEntityOfPage: `${SITE}/blog/${p.slug}/`, publisher: { "@type": "Organization", name: "Trip2 Punta Cana" } };
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="mb-3 text-xs text-ink/60"><Link href="/" className="hover:text-brand">Home</Link> › <Link href="/blog" className="hover:text-brand">Blog</Link></p>
      <div data-aos="zoom-in" className={`relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${grad(Math.max(0, basePosts.findIndex((x) => x.slug === p.slug)))}`} role="img" aria-label={p.alts?.[0] || p.h1}>{p.image && <img src={p.image} alt={p.alts?.[0] || p.h1} className="absolute inset-0 h-full w-full object-cover" />}</div>
      <h1 className="mt-6 text-3xl font-black text-brand" data-aos="zoom-out-left">{p.h1}</h1>
      <div className="mt-4" data-aos="zoom-out-right">{p.intro.map((x, k) => <p key={k} className="mb-3 leading-7 text-ink/80">{x}</p>)}</div>
      <Sections sections={p.sections} />
    </main>
  );
}
