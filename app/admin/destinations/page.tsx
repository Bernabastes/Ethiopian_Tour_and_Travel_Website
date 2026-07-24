import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DestinationAdminList } from "@/components/admin/DestinationAdminList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getRows() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.destination.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return null;
  }
}

export default async function AdminDestinationsPage() {
  const rows = await getRows();
  return (
    <AdminShell title="Destinations">
      <div className="mb-4 flex justify-end">
        <Link href="/admin/destinations/new" className="btn-green"><Plus size={16} /> New destination</Link>
      </div>
      {rows === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">Database not connected.</div>
      ) : (
        <DestinationAdminList
          initial={rows.map((d) => ({ id: d.id, slug: d.slug, name: d.name, region: d.region, image: d.image }))}
        />
      )}
    </AdminShell>
  );
}
