import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  UserCheck,
  ShieldCheck,
  BadgeDollarSign,
  Plane,
  Star,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { TourCard } from "@/components/TourCard";
import { getFeaturedTours, getDestinations, getReviews, getDestinationNameMap } from "@/lib/content";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

const whyChooseUs = [
  { icon: UserCheck, title: "Expert Local Guides", text: "Licensed, multilingual guides born and raised in Ethiopia." },
  { icon: ShieldCheck, title: "Safe & Insured Travel", text: "Vetted transport, 24/7 support, and a fully licensed operator." },
  { icon: BadgeDollarSign, title: "Best Price Guarantee", text: "Fair, transparent pricing in USD and ETB — no hidden fees." },
  { icon: Plane, title: "Door-to-Door Service", text: "Airport pickups, domestic flights and seamless logistics." },
  { icon: Star, title: "5,000+ Happy Travellers", text: "A decade of five-star reviews from around the world." },
  { icon: Sparkles, title: "Customizable Itineraries", text: "Tailor any tour to your dates, pace, and interests." },
];

export default async function HomePage() {
  const featured = await getFeaturedTours();
  const topDestinations = (await getDestinations()).slice(0, 8);
  const reviews = await getReviews();
  const destNames = await getDestinationNameMap();

  return (
    <>
      <Hero />

      {/* §2.3 Featured tours */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-gold-dark">
              Best Sellers
            </p>
            <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Featured Tours</h2>
            <p className="mt-3 text-ink/70">
              Hand-picked journeys that capture the very best of Ethiopia.
            </p>
          </div>
          <Link href="/tours" className="btn-ghost">
            Browse All Tours <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour) => (
            <TourCard key={tour.slug} tour={tour} destNames={destNames} />
          ))}
        </div>
      </section>

      {/* §2.4 Destinations preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Iconic Destinations</h2>
            <p className="mt-3 text-ink/70">
              From ancient churches to alien deserts — explore where your journey could begin.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {topDestinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl"
              >
                <Image
                  src={d.image}
                  alt={`${d.name}, Ethiopia — ${d.keyFact}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-heading text-lg text-white">{d.name}</h3>
                  <p className="text-xs text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {d.keyFact}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/destinations" className="btn-ghost">
              All Destinations <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* §2.5 Why choose us */}
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Why Travel With Us</h2>
          <p className="mt-3 text-ink/70">
            A decade of crafting safe, authentic and unforgettable Ethiopian journeys.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex items-start gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <Icon size={24} />
              </span>
              <div>
                <h3 className="font-heading text-lg text-brand-green-dark">{title}</h3>
                <p className="mt-1 text-sm text-ink/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials reviews={reviews} />

      {/* Trust signal (§2.6) */}
      <section className="bg-brand-green py-12 text-center text-white">
        <div className="container-page">
          <p className="text-lg font-semibold">
            ⭐ {company.ratings.googleScore} based on {company.ratings.googleReviews} Google Reviews
            &nbsp;·&nbsp; {company.ratings.tripadvisorScore} on TripAdvisor
          </p>
          <p className="mt-2 text-white/80">
            Join {company.stats.happyClients.toLocaleString()}+ travellers who explored Ethiopia with us.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl bg-brand-green-dark px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready for the journey of a lifetime?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Tell us your dates and dreams — we&apos;ll craft the perfect Ethiopian adventure for you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book" className="btn-primary px-7 text-base">
              Book Your Adventure
            </Link>
            <Link href="/contact" className="btn-outline px-6 text-base">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
