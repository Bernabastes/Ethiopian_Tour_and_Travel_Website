"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImageItem } from "@/data/types";

// §7.2 Gallery — category filter tabs + fullscreen lightbox with keyboard nav.
export function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((i) => i.category)))],
    [images],
  );
  const [tab, setTab] = useState("All");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () => (tab === "All" ? images : images.filter((i) => i.category === tab)),
    [images, tab],
  );

  const move = useCallback(
    (dir: number) => setIndex((i) => (i + dir + filtered.length) % filtered.length),
    [filtered.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  const show = (i: number) => { setIndex(i); setOpen(true); };

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === c ? "bg-brand-green text-white" : "bg-white text-ink/70 hover:bg-brand-green/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry-style columns */}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => show(i)}
            className="group relative block w-full overflow-hidden rounded-xl"
            aria-label={`View ${img.caption || "photo"}`}
          >
            <Image
              src={img.url}
              alt={img.caption || `${img.category} — Ethiopia`}
              width={600}
              height={i % 3 === 0 ? 800 : 600}
              sizes="(max-width: 640px) 50vw, 25vw"
              className="w-full transition-transform duration-500 group-hover:scale-105"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-ink/50">No photos in this category yet.</p>
      )}

      {/* Lightbox */}
      {open && filtered[index] && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90">
          <button onClick={() => setOpen(false)} aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X />
          </button>
          <button onClick={() => move(-1)} aria-label="Previous"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
            <ChevronLeft />
          </button>
          <div className="relative h-[80vh] w-[92vw] max-w-5xl">
            <Image src={filtered[index].url} alt={filtered[index].caption || "photo"} fill sizes="92vw" className="object-contain" />
          </div>
          <button onClick={() => move(1)} aria-label="Next"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
            <ChevronRight />
          </button>
          {filtered[index].caption && (
            <p className="absolute bottom-5 max-w-lg px-4 text-center text-sm text-white/80">{filtered[index].caption}</p>
          )}
        </div>
      )}
    </>
  );
}
