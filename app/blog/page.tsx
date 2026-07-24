import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Travel Blog — Ethiopia Travel Guides & Tips",
  description:
    "Expert Ethiopia travel guides: best time to visit, Lalibela, visas, packing lists, food, safety and more.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts({ publishedOnly: true });

  return (
    <div className="pt-[var(--header-h)]">
      <header className="bg-brand-green-dark py-12 text-center text-white">
        <div className="container-page">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Travel Blog</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            In-depth guides to help you plan the perfect Ethiopian adventure.
          </p>
        </div>
      </header>

      <section className="container-page py-12">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-ink/50">No articles published yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.slug} className="card group flex flex-col overflow-hidden">
                <Link href={`/blog/${p.slug}`} className="relative block aspect-[1200/630] overflow-hidden">
                  <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="badge absolute left-3 top-3 bg-black/55 text-white">{p.category}</span>
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-center gap-3 text-xs text-ink/50">
                    {p.publishedAt && <span>{new Date(p.publishedAt).toLocaleDateString()}</span>}
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {p.readMinutes} min read</span>
                  </div>
                  <h2 className="font-heading text-lg leading-snug text-brand-green-dark">
                    <Link href={`/blog/${p.slug}`} className="hover:text-brand-green">{p.title}</Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/70">{p.excerpt}</p>
                  <Link href={`/blog/${p.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline">
                    Read more <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
