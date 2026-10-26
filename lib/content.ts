// Content repository — the single place pages read content from.
// Reads from the database when DATABASE_URL is set; otherwise falls back to the
// static seed data in /data so the site still renders without a database.
//
// All functions are async and server-only (they import Prisma). Call them from
// server components and pass results to client components as props.

import { prisma } from "@/lib/prisma";
import type {
  Tour, Destination, Guide, Review, GalleryImageItem, BlogPostItem,
  Difficulty, TourCategory, ItineraryDay, PricingTier, GeoStop,
} from "@/data/types";

import { tours as staticTours } from "@/data/tours";
import { destinations as staticDestinations } from "@/data/destinations";
import { guides as staticGuides } from "@/data/guides";
import { reviews as staticReviews } from "@/data/reviews";
import { galleryImages as staticGallery } from "@/data/gallery";
import { blogPosts as staticBlog } from "@/data/blog";

const hasDatabaseConfigured = () => !!process.env.DATABASE_URL;

// ── Mappers (Prisma row → domain type). JSON columns are cast to known shapes. ──
type Json = unknown;
const arr = <T,>(v: Json): T[] => (Array.isArray(v) ? (v as T[]) : []);

function mapTour(r: {
  slug: string; name: string; category: string; durationDays: number; durationNights: number;
  priceFromUsd: number; difficulty: string; rating: number; reviewCount: number; groupSizeMax: number;
  startLocation: string; endLocation: string; shortDescription: string; description: Json; highlights: Json;
  images: Json; itinerary: Json; included: Json; excluded: Json; pricing: Json; route: Json;
  destinations: Json; featured: boolean;
}): Tour {
  return {
    slug: r.slug, name: r.name, category: r.category as TourCategory,
    durationDays: r.durationDays, durationNights: r.durationNights, priceFromUsd: r.priceFromUsd,
    difficulty: r.difficulty as Difficulty, rating: r.rating, reviewCount: r.reviewCount,
    groupSizeMax: r.groupSizeMax, startLocation: r.startLocation, endLocation: r.endLocation,
    shortDescription: r.shortDescription, description: arr<string>(r.description),
    highlights: arr<string>(r.highlights), images: arr<string>(r.images),
    itinerary: arr<ItineraryDay>(r.itinerary), included: arr<string>(r.included),
    excluded: arr<string>(r.excluded), pricing: arr<PricingTier>(r.pricing),
    route: arr<GeoStop>(r.route), destinations: arr<string>(r.destinations), featured: r.featured,
  };
}

// ───────────────────────────── Tours ─────────────────────────────
export async function getTours(): Promise<Tour[]> {
  if (!hasDatabaseConfigured()) return staticTours;
  try {
    const rows = await prisma.tour.findMany({ orderBy: { createdAt: "asc" } });
    return rows.length ? rows.map(mapTour) : staticTours;
  } catch {
    return staticTours;
  }
}

export async function getTour(slug: string): Promise<Tour | undefined> {
  if (!hasDatabaseConfigured()) return staticTours.find((t) => t.slug === slug);
  try {
    const r = await prisma.tour.findUnique({ where: { slug } });
    return r ? mapTour(r) : staticTours.find((t) => t.slug === slug);
  } catch {
    return staticTours.find((t) => t.slug === slug);
  }
}

export async function getFeaturedTours(): Promise<Tour[]> {
  return (await getTours()).filter((t) => t.featured);
}

export async function getToursByDestination(destSlug: string): Promise<Tour[]> {
  return (await getTours()).filter((t) => t.destinations.includes(destSlug));
}

// ────────────────────────── Destinations ──────────────────────────
export async function getDestinations(): Promise<Destination[]> {
  if (!hasDatabaseConfigured()) return staticDestinations;
  try {
    const rows = await prisma.destination.findMany({ orderBy: { createdAt: "asc" } });
    return rows.length
      ? rows.map((d) => ({ ...d, attractions: arr<string>(d.attractions) }) as Destination)
      : staticDestinations;
  } catch {
    return staticDestinations;
  }
}

export async function getDestination(slug: string): Promise<Destination | undefined> {
  const all = await getDestinations();
  return all.find((d) => d.slug === slug);
}

// Slug → display-name lookup for resolving a tour's destination labels.
export async function getDestinationNameMap(): Promise<Record<string, string>> {
  const all = await getDestinations();
  return Object.fromEntries(all.map((d) => [d.slug, d.name]));
}

// ───────────────────────────── Guides ─────────────────────────────
export async function getGuides(): Promise<Guide[]> {
  if (!hasDatabaseConfigured()) return staticGuides;
  try {
    const rows = await prisma.guide.findMany({ orderBy: { createdAt: "asc" } });
    return rows.length
      ? rows.map((g) => ({ ...g, specialties: arr<string>(g.specialties), languages: arr<string>(g.languages) }) as Guide)
      : staticGuides;
  } catch {
    return staticGuides;
  }
}

// ───────────────────────────── Reviews ────────────────────────────
export async function getReviews(): Promise<Review[]> {
  if (!hasDatabaseConfigured()) return staticReviews;
  try {
    const rows = await prisma.review.findMany({ where: { approved: true }, orderBy: { date: "desc" } });
    return rows.length
      ? rows.map((r) => ({
          id: r.id, name: r.name, country: r.country, countryFlag: r.countryFlag,
          rating: r.rating, tour: r.tour, date: r.date.toISOString().slice(0, 10), text: r.text,
        }))
      : staticReviews;
  } catch {
    return staticReviews;
  }
}

// ───────────────────────────── Gallery ────────────────────────────
export async function getGalleryImages(): Promise<GalleryImageItem[]> {
  if (!hasDatabaseConfigured()) return staticGallery;
  try {
    const rows = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    return rows.length
      ? rows.map((g) => ({ id: g.id, url: g.url, caption: g.caption ?? undefined, category: g.category, sortOrder: g.sortOrder }))
      : staticGallery;
  } catch {
    return staticGallery;
  }
}

// ────────────────────────────── Blog ──────────────────────────────
function mapBlog(b: {
  slug: string; title: string; excerpt: string; content: string; coverImage: string;
  category: string; author: string; readMinutes: number; metaTitle: string | null;
  metaDescription: string | null; published: boolean; publishedAt: Date | null;
}): BlogPostItem {
  return {
    slug: b.slug, title: b.title, excerpt: b.excerpt, content: b.content, coverImage: b.coverImage,
    category: b.category, author: b.author, readMinutes: b.readMinutes,
    metaTitle: b.metaTitle ?? undefined, metaDescription: b.metaDescription ?? undefined,
    published: b.published, publishedAt: b.publishedAt?.toISOString().slice(0, 10),
  };
}

export async function getBlogPosts(opts: { publishedOnly?: boolean } = {}): Promise<BlogPostItem[]> {
  const { publishedOnly = true } = opts;
  if (!hasDatabaseConfigured()) {
    const all = staticBlog;
    return publishedOnly ? all.filter((p) => p.published) : all;
  }
  try {
    const rows = await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(mapBlog);
  } catch {
    const all = staticBlog;
    return publishedOnly ? all.filter((p) => p.published) : all;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostItem | undefined> {
  if (!hasDatabaseConfigured()) return staticBlog.find((p) => p.slug === slug);
  try {
    const r = await prisma.blogPost.findUnique({ where: { slug } });
    return r ? mapBlog(r) : staticBlog.find((p) => p.slug === slug);
  } catch {
    return staticBlog.find((p) => p.slug === slug);
  }
}
