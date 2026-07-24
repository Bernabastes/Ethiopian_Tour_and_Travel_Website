import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

// POST (admin) → create a blog post.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(b.title ?? "").trim();
  if (!title) return NextResponse.json({ ok: false, error: "Title required" }, { status: 422 });

  let slug = b.slug ? slugify(String(b.slug)) : slugify(title);
  // Ensure unique slug
  if (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const published = Boolean(b.published);
  const created = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: String(b.excerpt ?? ""),
      content: String(b.content ?? ""),
      coverImage: String(b.coverImage ?? ""),
      category: String(b.category ?? "Travel Tips"),
      author: String(b.author ?? "Habesha Heritage Tours"),
      readMinutes: Number(b.readMinutes) || 5,
      metaTitle: b.metaTitle ? String(b.metaTitle) : null,
      metaDescription: b.metaDescription ? String(b.metaDescription) : null,
      published,
      publishedAt: published ? new Date() : null,
    },
  });
  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
