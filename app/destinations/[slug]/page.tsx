import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, CalendarCheck, Plane, Navigation, Sparkles } from "lucide-react";
import { getDestination, getToursByDestination, getDestinationNameMap } from "@/lib/content";
import { MapView } from "@/components/maps/MapView";
import { TourCard } from "@/components/TourCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return { title: "Destination not found" };
  return {
    title: `${d.name} Travel Guide — Tours & Things to Do`,
    description: `${d.keyFact}. ${d.overview.slice(0, 110)}… Discover ${d.name} tours, attractions and the best time to visit.`,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: { title: `${d.name}, Ethiopia`, description: d.keyFact, images: [d.image] },
  };
}

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();

  const relatedTours = await getToursByDestination(d.slug);
  const destNames = await getDestinationNameMap();

  return (
    <article className="pt-[var(--header-h)]">
      {/* Hero */}
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Image src={d.image} alt={`${d.name}, Ethiopia — ${d.keyFact}`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="container-page absolute inset-0 flex flex-col justify-end pb-8">
          <nav aria-label="Breadcrumb" className="mb-2 text-sm text-white/70">
            <ol className="flex gap-2">
              <li><Link href="/" className="hover:text-brand-gold">Home</Link></li>
              <li aria-hidden>›</li>
              <li><Link href="/destinations" className="hover:text-brand-gold">Destinations</Link></li>
              <li aria-hidden>›</li>
              <li className="text-brand-gold">{d.name}</li>
            </ol>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">{d.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-white/85"><MapPin size={16} /> {d.region}, Ethiopia</p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <p className="text-lg font-medium text-brand-green-dark">{d.keyFact}</p>
          <p className="mt-4 leading-relaxed text-ink/80">{d.overview}</p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold">Key Attractions</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {d.attractions.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-ink/80">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-gold" /> {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-4">
              <CalendarCheck className="text-brand-green" size={20} />
              <h3 className="mt-2 font-semibold">Best Time to Visit</h3>
              <p className="mt-1 text-sm text-ink/70">{d.bestTime}</p>
            </div>
            <div className="card p-4">
              <Plane className="text-brand-green" size={20} />
              <h3 className="mt-2 font-semibold">Getting There</h3>
              <p className="mt-1 text-sm text-ink/70">{d.gettingThere}</p>
            </div>
            <div className="card p-4">
              <Navigation className="text-brand-green" size={20} />
              <h3 className="mt-2 font-semibold">From Addis Ababa</h3>
              <p className="mt-1 text-sm text-ink/70">
                {d.distanceFromAddisKm === 0 ? "You're here — the capital." : `≈ ${d.distanceFromAddisKm} km`}
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold">Location</h2>
            <div className="mt-3 h-[320px] overflow-hidden rounded-xl border border-black/10">
              <MapView markers={[{ lat: d.lat, lng: d.lng, label: d.name }]} zoom={7} />
            </div>
          </section>
        </div>

        {/* Sidebar: related tours */}
        <aside>
          <div className="lg:sticky lg:top-[88px]">
            <div className="card p-5">
              <h2 className="font-heading text-lg text-brand-green-dark">Tours to {d.name}</h2>
              {relatedTours.length ? (
                <ul className="mt-3 space-y-3">
                  {relatedTours.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/tours/${t.slug}`} className="group flex gap-3">
                        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                          <Image src={t.images[0]} alt={t.name} fill sizes="80px" className="object-cover" />
                        </span>
                        <span className="text-sm">
                          <span className="font-medium text-ink group-hover:text-brand-green">{t.name}</span>
                          <span className="block text-xs text-ink/50">{t.durationDays} days · from ${t.priceFromUsd}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink/60">No dedicated tours yet — contact us to build a custom trip.</p>
              )}
              <Link href="/book" className="btn-primary mt-4 w-full text-sm">Plan a trip here</Link>
            </div>
          </div>
        </aside>
      </div>

      {relatedTours.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="mb-6 text-2xl font-bold">Featured {d.name} Tours</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTours.slice(0, 3).map((t) => <TourCard key={t.slug} tour={t} destNames={destNames} />)}
          </div>
        </section>
      )}
    </article>
  );
}
