import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  X,
  Clock,
  Users,
  Mountain,
  MapPin,
  Calendar,
  Star,
  Phone,
} from "lucide-react";
import { getTour, getTours, getToursByDestination, getDestinationNameMap } from "@/lib/content";
import { company, waLink } from "@/data/company";
import { formatUsd, formatEtb, formatDuration } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { GalleryHeader } from "@/components/tours/GalleryHeader";
import { ItineraryAccordion } from "@/components/tours/ItineraryAccordion";
import { MapView } from "@/components/maps/MapView";
import { FaqAccordion } from "@/components/FaqAccordion";
import { TourCard } from "@/components/TourCard";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: "Tour not found" };
  return {
    title: `${tour.name} — ${formatDuration(tour.durationDays, tour.durationNights)}`,
    description: `${tour.shortDescription} Expert-guided from ${formatUsd(
      tour.priceFromUsd,
    )} per person. Book your Ethiopian adventure today.`,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: `${tour.name} | ${company.name}`,
      description: tour.shortDescription,
      images: [tour.images[0]],
    },
  };
}

function perTourFaqs(tourName: string) {
  return [
    {
      question: "Is this tour suitable for children?",
      answer:
        "Yes — families are welcome. We adapt the pace and activities for younger travellers and offer a 50% discount for children aged 2–17. Please tell us their ages when booking so we can plan suitable accommodation and transport.",
    },
    {
      question: "What fitness level is required?",
      answer:
        "Each tour shows a difficulty badge. Cultural and historic tours are easy and suit most ages; mountain treks and the Danakil require good fitness. Contact us if you'd like advice for your group.",
    },
    {
      question: "What currency should I bring?",
      answer:
        "Ethiopia uses the Birr (ETB). Bring clean US dollars to exchange on arrival. Tour balances can be paid by international bank transfer in advance; card and mobile-money options are being added.",
    },
    {
      question: "Can this itinerary be customised?",
      answer: `Absolutely. ${tourName} can be tailored to your dates, pace, accommodation level and interests, or combined with other destinations. Just send us a message and we'll craft a custom quote within 24 hours.`,
    },
  ];
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const destNames = await getDestinationNameMap();
  const destinationName = (s: string) => destNames[s] ?? s;
  const allTours = await getTours();
  const related = allTours
    .filter((t) => t.slug !== tour.slug)
    .filter(
      (t) =>
        t.category === tour.category ||
        t.destinations.some((d) => tour.destinations.includes(d)),
    )
    .slice(0, 3);
  const relatedFinal = related.length
    ? related
    : (await getToursByDestination(tour.destinations[0])).slice(0, 3);

  const bookHref = `/book?tour=${tour.slug}`;
  const waMsg = `Hello! I'm interested in the "${tour.name}" tour. Could you share availability and details?`;

  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.shortDescription,
    image: tour.images[0],
    touristType: tour.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: tour.priceFromUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    itinerary: tour.route.map((s) => ({ "@type": "TouristAttraction", name: s.name })),
  };

  return (
    <article className="pb-4 pt-[var(--header-h)]">
      <JsonLd data={tripSchema} />
      {/* Breadcrumb (§1.4) */}
      <div className="container-page pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-brand-green">Home</Link></li>
            <li aria-hidden>›</li>
            <li><Link href="/tours" className="hover:text-brand-green">Tours</Link></li>
            <li aria-hidden>›</li>
            <li className="text-ink/80">{tour.name}</li>
          </ol>
        </nav>
      </div>

      {/* Title */}
      <header className="container-page pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge bg-brand-green/10 text-brand-green">{tour.category}</span>
          <DifficultyBadge level={tour.difficulty} />
          <Stars rating={tour.rating} count={tour.reviewCount} />
        </div>
        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{tour.name}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-ink/60">
          <MapPin size={16} /> {tour.destinations.map(destinationName).join(" · ")} · Ethiopia
        </p>
      </header>

      {/* Gallery */}
      <div className="container-page mt-5">
        <GalleryHeader images={tour.images} name={tour.name} />
      </div>

      {/* Body + sticky sidebar */}
      <div className="container-page mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Clock, label: "Duration", value: `${tour.durationDays} Days` },
              { icon: Users, label: "Group size", value: `Max ${tour.groupSizeMax}` },
              { icon: Mountain, label: "Difficulty", value: tour.difficulty },
              { icon: Calendar, label: "Start / End", value: `${tour.startLocation}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card flex flex-col items-center gap-1 p-4 text-center">
                <Icon size={20} className="text-brand-green" />
                <span className="text-[11px] uppercase tracking-wide text-ink/50">{label}</span>
                <span className="text-sm font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Overview</h2>
            <div className="mt-4 space-y-4 text-ink/80 leading-relaxed">
              {tour.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-brand-green/5 p-5">
              <h3 className="font-heading text-lg text-brand-green-dark">Tour Highlights</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink/80">
                    <Star size={16} className="mt-0.5 shrink-0 fill-brand-gold text-brand-gold" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Itinerary */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Day-by-Day Itinerary</h2>
            <p className="mt-1 text-sm text-ink/60">Tap any day to expand the details.</p>
            <div className="mt-4">
              <ItineraryAccordion days={tour.itinerary} />
            </div>
          </section>

          {/* Inclusions / Exclusions */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">What&apos;s Included</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <h3 className="mb-3 flex items-center gap-2 font-heading text-lg text-brand-green">
                  <Check size={18} /> Included
                </h3>
                <ul className="space-y-2">
                  {tour.included.map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-ink/80">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand-green" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="mb-3 flex items-center gap-2 font-heading text-lg text-danger">
                  <X size={18} /> Not Included
                </h3>
                <ul className="space-y-2">
                  {tour.excluded.map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-ink/80">
                      <X size={16} className="mt-0.5 shrink-0 text-danger" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Map (§3.3 / §8.5) */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Tour Route</h2>
            <p className="mt-1 text-sm text-ink/60">
              Numbered stops follow the itinerary order across Ethiopia.
            </p>
            <div className="mt-4 h-[360px] overflow-hidden rounded-xl border border-black/10">
              <MapView
                markers={tour.route.map((s, i) => ({
                  lat: s.lat,
                  lng: s.lng,
                  label: s.name,
                  index: i + 1,
                }))}
                showRoute
                zoom={6}
              />
            </div>
          </section>

          {/* Pricing table */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Pricing</h2>
            <p className="mt-1 text-sm text-ink/60">
              Price per person varies by group size. Children (2–17) receive 50% off.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
              <table className="w-full text-sm">
                <thead className="bg-brand-green text-left text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Group Size</th>
                    <th className="px-4 py-3 font-semibold">Price (USD)</th>
                    <th className="px-4 py-3 font-semibold">Price (ETB)</th>
                  </tr>
                </thead>
                <tbody>
                  {tour.pricing.map((row, i) => (
                    <tr key={row.label} className={i % 2 ? "bg-cream/50" : "bg-white"}>
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      <td className="px-4 py-3">
                        {row.usd == null ? (
                          <span className="text-brand-green">{row.note}</span>
                        ) : (
                          <>
                            {formatUsd(row.usd)}
                            {row.note ? <span className="text-ink/50"> {row.note}</span> : null}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink/60">
                        {row.usd == null ? "—" : formatEtb(row.usd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ per tour */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-4">
              <FaqAccordion items={perTourFaqs(tour.name)} />
            </div>
          </section>
        </div>

        {/* Sticky overview / booking sidebar (§3.3) */}
        <aside className="lg:relative">
          <div className="lg:sticky lg:top-[88px]">
            <div className="card p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-ink/50">From</p>
                  <p className="font-heading text-3xl font-bold text-brand-green">
                    {formatUsd(tour.priceFromUsd)}
                  </p>
                  <p className="text-xs text-ink/50">
                    per person · {formatEtb(tour.priceFromUsd)}
                  </p>
                </div>
                <Stars rating={tour.rating} showNumber size={14} />
              </div>

              <dl className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/55">Duration</dt>
                  <dd className="font-medium">{formatDuration(tour.durationDays, tour.durationNights)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Group size</dt>
                  <dd className="font-medium">Up to {tour.groupSizeMax}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Difficulty</dt>
                  <dd className="font-medium">{tour.difficulty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Start / End</dt>
                  <dd className="font-medium text-right">
                    {tour.startLocation} / {tour.endLocation}
                  </dd>
                </div>
              </dl>

              <Link href={bookHref} className="btn-primary mt-5 w-full text-base">
                Book This Tour
              </Link>
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-2 w-full text-sm"
              >
                <Phone size={16} /> Ask on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-ink/50">
                Free cancellation up to 30 days before · 30% deposit to confirm
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Related tours */}
      {relatedFinal.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFinal.map((t) => (
              <TourCard key={t.slug} tour={t} destNames={destNames} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
