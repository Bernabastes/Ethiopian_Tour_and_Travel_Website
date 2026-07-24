import type { Metadata } from "next";
import { ToursExplorer } from "@/components/tours/ToursExplorer";
import type { Filters } from "@/lib/tourFilters";
import { TOUR_CATEGORIES } from "@/data/tours";
import { company } from "@/data/company";
import { getTours, getDestinations } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ethiopia Tours & Packages — Browse All Trips",
  description:
    "Browse all our expert-guided Ethiopia tours: historical circuits, Simien & Bale trekking, Omo Valley culture, Danakil expeditions and more. Filter by destination, duration & price.",
  alternates: { canonical: "/tours" },
};

type SP = Record<string, string | string[] | undefined>;

function toInitialFilters(sp: SP): Partial<Filters> {
  const initial: Partial<Filters> = {};
  const destination = typeof sp.destination === "string" ? sp.destination : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const duration = typeof sp.duration === "string" ? sp.duration : undefined;

  if (destination) initial.destinations = [destination];
  if (type && (TOUR_CATEGORIES as readonly string[]).includes(type)) initial.types = [type];
  if (duration && ["1-3", "4-7", "8-14", "15+"].includes(duration))
    initial.durations = [duration];
  return initial;
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const initial = toInitialFilters(sp);
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);

  return (
    <>
      {/* Page header */}
      <header className="bg-brand-green-dark pb-12 pt-[calc(var(--header-h)+2rem)] text-center text-white">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-white/60">
            <ol className="flex justify-center gap-2">
              <li>Home</li>
              <li aria-hidden>›</li>
              <li className="text-brand-gold">Tours &amp; Packages</li>
            </ol>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Ethiopia Tours &amp; Packages
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            {company.stats.toursCompleted.toLocaleString()}+ tours delivered. Find your perfect
            Ethiopian adventure below.
          </p>
        </div>
      </header>

      <ToursExplorer
        initial={initial}
        tours={tours}
        destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
      />
    </>
  );
}
