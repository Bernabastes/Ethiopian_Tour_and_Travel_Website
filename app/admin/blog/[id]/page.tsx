import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor, type BlogDraft } from "@/components/admin/BlogEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();
  const p = await prisma.blogPost.findUnique({ where: { id } });
  if (!p) notFound();

  const draft: BlogDraft = {
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
    coverImage: p.coverImage, category: p.category, author: p.author, readMinutes: p.readMinutes,
    metaTitle: p.metaTitle ?? "", metaDescription: p.metaDescription ?? "", published: p.published,
  };

  return (
    <AdminShell title="Edit post">
      <BlogEditor initial={draft} />
    </AdminShell>
  );
}
