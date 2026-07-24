import { AdminShell } from "@/components/admin/AdminShell";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getImages() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  } catch {
    return null;
  }
}

export default async function AdminGalleryPage() {
  const images = await getImages();
  return (
    <AdminShell title="Gallery">
      {images === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Database not connected, or run <code className="rounded bg-black/5 px-1">npm run db:migrate</code> to add the gallery table.
        </div>
      ) : (
        <GalleryManager
          initial={images.map((g) => ({
            id: g.id, url: g.url, caption: g.caption, category: g.category, sortOrder: g.sortOrder,
          }))}
        />
      )}
    </AdminShell>
  );
}
