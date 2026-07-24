import type { Tour } from "@/data/types";

export interface Filters {
  destinations: string[];
  durations: string[]; // "1-3" | "4-7" | "8-14" | "15+"
  types: string[];
  priceMin: number;
  priceMax: number;
  groupSize: string; // "" | "solo" | "small" | "medium" | "large" | "private"
}

export const PRICE_FLOOR = 0;
export const PRICE_CEIL = 5000;

export const emptyFilters = (): Filters => ({
  destinations: [],
  durations: [],
  types: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  groupSize: "",
});

export const DURATION_BUCKETS: Record<string, (d: number) => boolean> = {
  "1-3": (d) => d >= 1 && d <= 3,
  "4-7": (d) => d >= 4 && d <= 7,
  "8-14": (d) => d >= 8 && d <= 14,
  "15+": (d) => d >= 15,
};

export const GROUP_SIZE_FILTERS: Record<string, (max: number) => boolean> = {
  solo: () => true,
  small: (max) => max >= 6,
  medium: (max) => max >= 15,
  large: (max) => max >= 16,
  private: () => true,
};

export type SortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "duration-asc"
  | "newest"
  | "rating";

export function applyFilters(tours: Tour[], f: Filters): Tour[] {
  return tours.filter((t) => {
    if (f.destinations.length && !t.destinations.some((d) => f.destinations.includes(d)))
      return false;
    if (f.durations.length && !f.durations.some((b) => DURATION_BUCKETS[b]?.(t.durationDays)))
      return false;
    if (f.types.length && !f.types.includes(t.category)) return false;
    if (t.priceFromUsd < f.priceMin) return false;
    if (f.priceMax < PRICE_CEIL && t.priceFromUsd > f.priceMax) return false;
    if (f.groupSize && !GROUP_SIZE_FILTERS[f.groupSize]?.(t.groupSizeMax)) return false;
    return true;
  });
}

export function sortTours(tours: Tour[], key: SortKey): Tour[] {
  const arr = [...tours];
  switch (key) {
    case "price-asc":
      return arr.sort((a, b) => a.priceFromUsd - b.priceFromUsd);
    case "price-desc":
      return arr.sort((a, b) => b.priceFromUsd - a.priceFromUsd);
    case "duration-asc":
      return arr.sort((a, b) => a.durationDays - b.durationDays);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "newest":
      return arr.reverse();
    case "popular":
    default:
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export const countActive = (f: Filters): number =>
  f.destinations.length +
  f.durations.length +
  f.types.length +
  (f.groupSize ? 1 : 0) +
  (f.priceMin > PRICE_FLOOR || f.priceMax < PRICE_CEIL ? 1 : 0);
