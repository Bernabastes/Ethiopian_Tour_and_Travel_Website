// Shared domain types for the Ethiopian tour operator site.

export type Difficulty = "Easy" | "Moderate" | "Challenging";

export type TourCategory =
  | "Historical & Cultural"
  | "Trekking & Adventure"
  | "Wildlife Safari"
  | "Religious Pilgrimage"
  | "Photography Tours"
  | "Volunteer Tours";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string; // e.g. "Breakfast, Lunch, Dinner"
  hotel?: string;
}

export interface PricingTier {
  label: string; // e.g. "1 person" / "2–3 persons"
  usd: number | null; // null => "contact for quote"
  note?: string;
}

export interface GeoStop {
  name: string;
  lat: number;
  lng: number;
}

export interface Tour {
  slug: string;
  name: string;
  destinations: string[]; // destination slugs
  category: TourCategory;
  durationDays: number;
  durationNights: number;
  priceFromUsd: number;
  difficulty: Difficulty;
  rating: number; // 0–5
  reviewCount: number;
  groupSizeMax: number;
  startLocation: string;
  endLocation: string;
  shortDescription: string;
  description: string[]; // paragraphs
  highlights: string[];
  images: string[]; // gallery (first = hero)
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  pricing: PricingTier[];
  route: GeoStop[];
  featured?: boolean;
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  keyFact: string;
  overview: string;
  attractions: string[];
  bestTime: string;
  gettingThere: string;
  image: string;
  lat: number;
  lng: number;
  distanceFromAddisKm: number;
}

export interface Guide {
  slug: string;
  name: string;
  title: string;
  yearsExperience: number;
  licenseNumber: string; // ETO license
  specialties: string[];
  languages: string[];
  bio: string;
  rating: number;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  countryFlag: string; // emoji
  rating: number;
  tour: string;
  date: string; // ISO
  text: string;
}

export interface Faq {
  category: string;
  question: string;
  answer: string;
}

export interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
  category: string;
  sortOrder: number;
}

export interface BlogPostItem {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown-ish / paragraphs separated by blank lines
  coverImage: string;
  category: string;
  author: string;
  readMinutes: number;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt?: string;
}
