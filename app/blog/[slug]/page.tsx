import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { PostBody } from "@/components/blog/PostBody";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getBlogPost(slug);
  if (!p) return { title: "Article not found" };
  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, images: [p.coverImage], type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || !post.published) notFound();

  const related = (await getBlogPosts({ publishedOnly: true }))
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <article className="pt-[var(--header-h)]">
      <div className="relative h-[44vh] min-h-[300px] w-full overflow-hidden">
        <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="container-page absolute inset-0 mx-auto flex max-w-3xl flex-col justify-end pb-8">
          <span className="badge w-fit bg-brand-gold text-ink">{post.category}</span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">{post.title}</h1>
          <p className="mt-2 flex items-center gap-3 text-sm text-white/80">
            <span>{post.author}</span>
            {post.publishedAt && <span>· {new Date(post.publishedAt).toLocaleDateString()}</span>}
            <span className="inline-flex items-center gap-1">· <Clock size={13} /> {post.readMinutes} min read</span>
          </p>
        </div>
      </div>

      <div className="container-page mx-auto max-w-3xl py-10">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-brand-green">
          <ArrowLeft size={15} /> All articles
        </Link>
        <PostBody content={post.content} />

        <div className="mt-10 rounded-2xl bg-brand-green/5 p-6 text-center">
          <p className="font-heading text-lg text-brand-green-dark">Ready to experience it yourself?</p>
          <Link href="/tours" className="btn-green mt-3">Browse our Ethiopia tours</Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page mx-auto max-w-5xl pb-16">
          <h2 className="mb-6 text-2xl font-bold">Related articles</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card group overflow-hidden">
                <span className="relative block aspect-[1200/630] overflow-hidden">
                  <Image src={p.coverImage} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="block p-3 text-sm font-medium text-ink/80 group-hover:text-brand-green">{p.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="sr-only">Published by {company.name}</p>
    </article>
  );
}
