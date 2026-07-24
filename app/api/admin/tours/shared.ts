// Normalises a tour payload from the editor into Prisma create/update data.
// JSON array fields are stored as-is in the Tour model's Json columns.
export function tourDataFromBody(b: Record<string, unknown>) {
  const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

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
    description: list<string>(b.description),
    highlights: list<string>(b.highlights),
    images: list<string>(b.images),
    itinerary: list<unknown>(b.itinerary),
    included: list<string>(b.included),
    excluded: list<string>(b.excluded),
    pricing: list<unknown>(b.pricing),
    route: list<unknown>(b.route),
    destinations: list<string>(b.destinations),
    featured: Boolean(b.featured),
  };
}
