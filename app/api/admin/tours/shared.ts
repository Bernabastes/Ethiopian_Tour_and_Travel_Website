import type { Prisma } from "@prisma/client";

// Normalises a tour payload from the editor into Prisma create/update data.
// JSON array fields are stored as-is in the Tour model's Json columns.
export function tourDataFromBody(b: Record<string, unknown>) {
  const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const list = (v: unknown): Prisma.InputJsonArray =>
    JSON.parse(JSON.stringify(Array.isArray(v) ? v : []));

  return {
    name: String(b.name ?? ""),
    category: String(b.category ?? "Historical & Cultural"),
    durationDays: num(b.durationDays, 1),
    durationNights: num(b.durationNights, 0),
    priceFromUsd: num(b.priceFromUsd, 0),
    difficulty: String(b.difficulty ?? "Easy"),
    rating: num(b.rating, 5),
    reviewCount: num(b.reviewCount, 0),
    groupSizeMax: num(b.groupSizeMax, 12),
    startLocation: String(b.startLocation ?? "Addis Ababa"),
    endLocation: String(b.endLocation ?? "Addis Ababa"),
    shortDescription: String(b.shortDescription ?? ""),
    description: list(b.description),
    highlights: list(b.highlights),
    images: list(b.images),
    itinerary: list(b.itinerary),
    included: list(b.included),
    excluded: list(b.excluded),
    pricing: list(b.pricing),
    route: list(b.route),
    destinations: list(b.destinations),
    featured: Boolean(b.featured),
  };
}
