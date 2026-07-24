import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { getTours, getDestinations, getBlogPosts } from "@/lib/content";

// §8.1 Auto-generated XML sitemap — static pages, tours, destinations, blog posts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = company.url;
  const [tours, destinations, posts] = await Promise.all([
    getTours(),
    getDestinations(),
    getBlogPosts({ publishedOnly: true }),
  ]);

  const staticPaths = [
    "", "/tours", "/destinations", "/about", "/contact", "/gallery", "/blog", "/book",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const tourPaths = tours.map((t) => ({
    url: `${base}/tours/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const destPaths = destinations.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPaths = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPaths, ...tourPaths, ...destPaths, ...blogPaths];
}
