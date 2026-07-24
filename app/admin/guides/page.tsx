import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { GuideAdminList } from "@/components/admin/GuideAdminList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getRows() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.guide.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return null;
  }
}

export default async function AdminGuidesPage() {
  const rows = await getRows();
  return (
    <AdminShell title="Guides">
      <div className="mb-4 flex justify-end">
        <Link href="/admin/guides/new" className="btn-green"><Plus size={16} /> New guide</Link>
      </div>
      {rows === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">Database not connected.</div>
      ) : (
        <GuideAdminList
          initial={rows.map((g) => ({ id: g.id, name: g.name, title: g.title, image: g.image, licenseNumber: g.licenseNumber }))}
        />
      )}
    </AdminShell>
  );
}
