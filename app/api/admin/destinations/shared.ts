// Normalises a destination payload from the editor into Prisma create/update data.
export function destinationDataFrom(b: Record<string, unknown>) {
  const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  return {
    name: String(b.name ?? ""),
    region: String(b.region ?? ""),
    keyFact: String(b.keyFact ?? ""),
    overview: String(b.overview ?? ""),
    attractions: Array.isArray(b.attractions) ? (b.attractions as string[]) : [],
    bestTime: String(b.bestTime ?? ""),
    gettingThere: String(b.gettingThere ?? ""),
    image: String(b.image ?? ""),
    lat: num(b.lat, 9.0),
    lng: num(b.lng, 38.7),
    distanceFromAddisKm: num(b.distanceFromAddisKm),
  };
}
