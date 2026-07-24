import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAvailability } from "@/components/admin/AdminAvailability";
import { getTours } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const tours = await getTours();
  const tourOpts = tours.map((t) => ({ slug: t.slug, name: t.name }));
  return (
    <AdminShell title="Availability">
      <AdminAvailability tours={tourOpts} />
    </AdminShell>
  );
}
