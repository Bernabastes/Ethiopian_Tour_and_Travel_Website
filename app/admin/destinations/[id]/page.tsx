import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DestinationEditor, type DestinationDraft } from "@/components/admin/DestinationEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();
  const d = await prisma.destination.findUnique({ where: { id } });
  if (!d) notFound();

  const draft: DestinationDraft = {
    id: d.id, name: d.name, slug: d.slug, region: d.region, keyFact: d.keyFact,
    overview: d.overview, attractions: arr<string>(d.attractions), bestTime: d.bestTime,
    gettingThere: d.gettingThere, image: d.image, lat: d.lat, lng: d.lng,
    distanceFromAddisKm: d.distanceFromAddisKm,
  };

  return (
    <AdminShell title="Edit destination">
      <DestinationEditor initial={draft} />
    </AdminShell>
  );
}
