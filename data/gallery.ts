import type { GalleryImageItem } from "./types";

export const GALLERY_CATEGORIES = [
  "Landscapes",
  "Wildlife",
  "Culture & People",
  "Historical Sites",
  "Food",
  "Hotels & Camps",
] as const;

// Existing placeholder gallery — preserved and seeded into the DB so it stays editable.
const cats = GALLERY_CATEGORIES;
export const galleryImages: GalleryImageItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: `seed-gallery-${i + 1}`,
  url: `https://picsum.photos/seed/gallery-${i}/800/${i % 3 === 0 ? 1000 : 800}`,
  caption: undefined,
  category: cats[i % cats.length],
  sortOrder: i,
}));
