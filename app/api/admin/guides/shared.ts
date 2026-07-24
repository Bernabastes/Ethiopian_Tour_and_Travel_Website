export function guideDataFrom(b: Record<string, unknown>) {
  const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const list = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
  return {
    name: String(b.name ?? ""),
    title: String(b.title ?? ""),
    yearsExperience: num(b.yearsExperience),
    licenseNumber: String(b.licenseNumber ?? ""),
    specialties: list(b.specialties),
    languages: list(b.languages),
    bio: String(b.bio ?? ""),
    rating: num(b.rating, 5),
    image: String(b.image ?? ""),
  };
}
