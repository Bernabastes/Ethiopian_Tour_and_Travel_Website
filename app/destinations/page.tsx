import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { getDestinations } from "@/lib/content";
import { MapView } from "@/components/maps/MapView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ethiopia Destinations — Where to Go",
  description:
    "Explore Ethiopia's greatest destinations: Lalibela, Gondar, Axum, the Simien & Bale Mountains, the Omo Valley, Danakil Depression, Harar and more. Find tours for each.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <div className="pt-[var(--header-h)]">
      <header className="bg-brand-green-dark py-12 text-center text-white">
        <div className="container-page">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Discover Ethiopia&apos;s Destinations
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            From rock-hewn churches to alien deserts and misty mountains — explore the places that
            make Ethiopia unforgettable.
          </p>
        </div>
      </header>

      {/* Interactive pin map (§8.5 Destination Pins Map) */}
      <section className="container-page py-10">
        <div className="h-[420px] overflow-hidden rounded-2xl border border-black/10">
          <MapView
            markers={destinations.map((d) => ({ lat: d.lat, lng: d.lng, label: d.name }))}
            zoom={6}
          />
        </div>
      </section>

      {/* Grid */}
      <section className="container-page pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <article key={d.slug} className="card group overflow-hidden">
              <Link href={`/destinations/${d.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={d.image}
                  alt={`${d.name}, Ethiopia — ${d.keyFact}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="font-heading text-xl text-white">{d.name}</h2>
                  <p className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin size={12} /> {d.region}
                  </p>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-sm text-ink/70">{d.keyFact}</p>
                <Link href={`/destinations/${d.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline">
                  Explore {d.name} <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
