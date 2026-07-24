import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogAdminList } from "@/components/admin/BlogAdminList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPosts() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return null;
  }
}

export default async function AdminBlogPage() {
  const posts = await getPosts();
  return (
    <AdminShell title="Blog">
      <div className="mb-4 flex justify-end">
        <Link href="/admin/blog/new" className="btn-green"><Plus size={16} /> New post</Link>
      </div>
      {posts === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">Database not connected.</div>
      ) : (
        <BlogAdminList
          initial={posts.map((p) => ({
            id: p.id, title: p.title, slug: p.slug, category: p.category,
            published: p.published, publishedAt: p.publishedAt?.toISOString() ?? null,
          }))}
        />
      )}
    </AdminShell>
  );
}
