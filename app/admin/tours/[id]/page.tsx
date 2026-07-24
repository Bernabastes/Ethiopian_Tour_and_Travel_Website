import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TourEditor, type TourDraft } from "@/components/admin/TourEditor";
import { prisma } from "@/lib/prisma";
import { getDestinations } from "@/lib/content";

export const dynamic = "force-dynamic";

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();
  const t = await prisma.tour.findUnique({ where: { id } });
  if (!t) notFound();

  const destinations = await getDestinations();

  const draft: TourDraft = {
    id: t.id, name: t.name, slug: t.slug, category: t.category, difficulty: t.difficulty,
    durationDays: t.durationDays, durationNights: t.durationNights, priceFromUsd: t.priceFromUsd,
    rating: t.rating, reviewCount: t.reviewCount, groupSizeMax: t.groupSizeMax,
    startLocation: t.startLocation, endLocation: t.endLocation, featured: t.featured,
    destinations: arr<string>(t.destinations), shortDescription: t.shortDescription,
    description: arr<string>(t.description), highlights: arr<string>(t.highlights),
    images: arr<string>(t.images), itinerary: arr<TourDraft["itinerary"][number]>(t.itinerary),
    included: arr<string>(t.included), excluded: arr<string>(t.excluded),
    pricing: arr<TourDraft["pricing"][number]>(t.pricing), route: arr<TourDraft["route"][number]>(t.route),
  };

  return (
    <AdminShell title="Edit tour">
      <TourEditor
        initial={draft}
        destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
      />
    </AdminShell>
  );
}
