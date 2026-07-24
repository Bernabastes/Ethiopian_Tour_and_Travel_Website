// Seeds the database from the existing mock data in /data, and creates an admin user.
// Run with:  npm run db:seed   (after `prisma migrate dev`)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { tours } from "../data/tours";
import { destinations } from "../data/destinations";
import { guides } from "../data/guides";
import { reviews } from "../data/reviews";
import { galleryImages } from "../data/gallery";
import { blogPosts } from "../data/blog";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // Tours
  for (const t of tours) {
    await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        name: t.name,
        category: t.category,
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        priceFromUsd: t.priceFromUsd,
        difficulty: t.difficulty,
        rating: t.rating,
        reviewCount: t.reviewCount,
        groupSizeMax: t.groupSizeMax,
        startLocation: t.startLocation,
        endLocation: t.endLocation,
        shortDescription: t.shortDescription,
        description: t.description,
        highlights: t.highlights,
        images: t.images,
        itinerary: t.itinerary,
        included: t.included,
        excluded: t.excluded,
        pricing: t.pricing,
        route: t.route,
        destinations: t.destinations,
        featured: t.featured ?? false,
      },
    });
  }
  console.log(`  ✓ ${tours.length} tours`);

  // Destinations
  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        name: d.name,
        region: d.region,
        keyFact: d.keyFact,
        overview: d.overview,
        attractions: d.attractions,
        bestTime: d.bestTime,
        gettingThere: d.gettingThere,
        image: d.image,
        lat: d.lat,
        lng: d.lng,
        distanceFromAddisKm: d.distanceFromAddisKm,
      },
    });
  }
  console.log(`  ✓ ${destinations.length} destinations`);

  // Guides
  for (const g of guides) {
    await prisma.guide.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug,
        name: g.name,
        title: g.title,
        yearsExperience: g.yearsExperience,
        licenseNumber: g.licenseNumber,
        specialties: g.specialties,
        languages: g.languages,
        bio: g.bio,
        rating: g.rating,
        image: g.image,
      },
    });
  }
  console.log(`  ✓ ${guides.length} guides`);

  // Reviews — only seed when empty so admin-added reviews are never wiped.
  if ((await prisma.review.count()) === 0) {
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          name: r.name,
          country: r.country,
          countryFlag: r.countryFlag,
          rating: r.rating,
          tour: r.tour,
          date: new Date(r.date),
          text: r.text,
        },
      });
    }
    console.log(`  ✓ ${reviews.length} reviews`);
  } else {
    console.log("  • reviews already present — skipped");
  }

  // Gallery images (idempotent: only seed if empty, so owner edits aren't overwritten)
  if ((await prisma.galleryImage.count()) === 0) {
    for (const g of galleryImages) {
      await prisma.galleryImage.create({
        data: { url: g.url, caption: g.caption ?? null, category: g.category, sortOrder: g.sortOrder },
      });
    }
    console.log(`  ✓ ${galleryImages.length} gallery images`);
  } else {
    console.log("  • gallery images already present — skipped");
  }

  // Blog posts
  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        category: b.category,
        author: b.author,
        readMinutes: b.readMinutes,
        metaTitle: b.metaTitle ?? null,
        metaDescription: b.metaDescription ?? null,
        published: b.published,
        publishedAt: b.publishedAt ? new Date(b.publishedAt) : null,
      },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts`);

  // Admin user (credentials from env; real bcrypt hash is set by the auth setup script)
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@habeshaheritagetours.com";
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Owner",
      passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? "changeme", 10),
      role: "owner",
    },
  });
  console.log(`  ✓ admin user (${adminEmail})`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
