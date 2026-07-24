import { AdminShell } from "@/components/admin/AdminShell";
import { TourEditor, type TourDraft } from "@/components/admin/TourEditor";
import { getDestinations } from "@/lib/content";

export const dynamic = "force-dynamic";

const empty: TourDraft = {
  name: "", slug: "", category: "Historical & Cultural", difficulty: "Easy",
  durationDays: 4, durationNights: 3, priceFromUsd: 650, rating: 5, reviewCount: 0,
  groupSizeMax: 12, startLocation: "Addis Ababa", endLocation: "Addis Ababa", featured: false,
  destinations: [], shortDescription: "", description: [""], highlights: [""], images: [],
  itinerary: [{ day: 1, title: "", description: "" }], included: [""], excluded: [""],
  pricing: [{ label: "Per person", usd: 650 }], route: [],
};

export default async function NewTourPage() {
  const destinations = await getDestinations();
  return (
    <AdminShell title="New tour">
      <TourEditor
        initial={empty}
        destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
      />
    </AdminShell>
  );
}
