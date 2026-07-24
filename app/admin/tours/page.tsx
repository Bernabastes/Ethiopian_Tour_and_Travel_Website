import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { TourAdminList } from "@/components/admin/TourAdminList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getTours() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.tour.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return null;
  }
}

export default async function AdminToursPage() {
  const tours = await getTours();
  return (
    <AdminShell title="Tours">
      <div className="mb-4 flex justify-end">
        <Link href="/admin/tours/new" className="btn-green"><Plus size={16} /> New tour</Link>
      </div>
      {tours === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">Database not connected.</div>
      ) : (
        <TourAdminList
          initial={tours.map((t) => ({
            id: t.id, slug: t.slug, name: t.name, category: t.category,
            priceFromUsd: t.priceFromUsd, durationDays: t.durationDays,
            image: Array.isArray(t.images) && t.images.length ? String(t.images[0]) : "",
            featured: t.featured,
          }))}
        />
      )}
    </AdminShell>
  );
}
