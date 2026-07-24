import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photo Gallery — Ethiopia in Pictures",
  description:
    "A visual journey through Ethiopia — landscapes, wildlife, culture, historical sites and more from our tours.",
  alternates: { canonical: "/gallery" },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="pt-[var(--header-h)]">
      <header className="bg-brand-green-dark py-12 text-center text-white">
        <div className="container-page">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Photo Gallery</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            A glimpse of the beauty that awaits you in Ethiopia.
          </p>
        </div>
      </header>

      <section className="container-page py-12">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
