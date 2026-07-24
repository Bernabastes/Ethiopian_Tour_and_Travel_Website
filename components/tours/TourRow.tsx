import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import type { Tour } from "@/data/types";
import { Stars } from "../ui/Stars";
import { DifficultyBadge } from "../ui/DifficultyBadge";
import { formatUsd, formatEtb, formatDuration } from "@/lib/format";
import { destinationName } from "@/data/destinations";

// §3.1 Optional list view — more detail per row.
export function TourRow({
  tour,
  destNames,
}: {
  tour: Tour;
  // Optional DB-backed slug→name map; falls back to static data when omitted.
  destNames?: Record<string, string>;
}) {
  const nameOf = (slug: string) => destNames?.[slug] ?? destinationName(slug);
  return (
    <article className="card group grid gap-4 overflow-hidden p-3 sm:grid-cols-[260px_1fr]">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-lg sm:aspect-auto">
        <Image
          src={tour.images[0]}
          alt={`${tour.name} — ${nameOf(tour.destinations[0])}, Ethiopia`}
          fill
          sizes="(max-width: 640px) 100vw, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2">
          <DifficultyBadge level={tour.difficulty} />
        </span>
      </Link>

      <div className="flex flex-col py-1 pr-2">
        <div className="flex items-center justify-between gap-2">
          <span className="badge bg-brand-green/10 text-brand-green">{tour.category}</span>
          <Stars rating={tour.rating} count={tour.reviewCount} size={14} />
        </div>
        <h3 className="mt-2 font-heading text-xl text-brand-green-dark">
          <Link href={`/tours/${tour.slug}`} className="hover:text-brand-green">
            {tour.name}
          </Link>
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {formatDuration(tour.durationDays, tour.durationNights)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {tour.destinations.map(nameOf).join(" · ")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> Max {tour.groupSizeMax}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ink/70">{tour.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-xs text-ink/50">From </span>
            <span className="font-heading text-xl font-bold text-brand-green">
              {formatUsd(tour.priceFromUsd)}
            </span>
            <span className="text-xs text-ink/50"> / person · {formatEtb(tour.priceFromUsd)}</span>
          </div>
          <Link href={`/tours/${tour.slug}`} className="btn-green px-4 text-sm">
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
