import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin } from "lucide-react";
import type { Tour } from "@/data/types";
import { Stars } from "./ui/Stars";
import { DifficultyBadge } from "./ui/DifficultyBadge";
import { formatUsd, formatEtb, formatDuration } from "@/lib/format";
import { destinationName } from "@/data/destinations";

export function TourCard({
  tour,
  destNames,
}: {
  tour: Tour;
  // Optional DB-backed slug→name map; falls back to static data when omitted.
  destNames?: Record<string, string>;
}) {
  const nameOf = (slug: string) => destNames?.[slug] ?? destinationName(slug);
  return (
    <article className="card group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={tour.images[0]}
          alt={`${tour.name} — ${nameOf(tour.destinations[0])}, Ethiopia`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <DifficultyBadge level={tour.difficulty} />
        </span>
        <span className="badge absolute right-3 top-3 bg-black/55 text-white">
          {tour.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {formatDuration(tour.durationDays, tour.durationNights)}
          </span>
          <Stars rating={tour.rating} count={tour.reviewCount} size={14} showNumber={false} />
        </div>

        <h3 className="font-heading text-lg leading-snug text-brand-green-dark">
          <Link href={`/tours/${tour.slug}`} className="hover:text-brand-green">
            {tour.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-ink/55">
          <MapPin size={13} />
          {tour.destinations.map(nameOf).join(" · ")}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-ink/70">{tour.shortDescription}</p>

        <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-3">
          <div>
            <p className="text-xs text-ink/50">From</p>
            <p className="font-heading text-xl font-bold text-brand-green">
              {formatUsd(tour.priceFromUsd)}
              <span className="text-xs font-normal text-ink/50"> / person</span>
            </p>
            <p className="text-[11px] text-ink/45">{formatEtb(tour.priceFromUsd)}</p>
          </div>
          <Link href={`/tours/${tour.slug}`} className="btn-green px-4 text-sm">
            View Tour
          </Link>
        </div>
      </div>
    </article>
  );
}
