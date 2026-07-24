"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

// §3.3 Photo gallery header — large main image + thumbnail grid, click → fullscreen lightbox.
export function GalleryHeader({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const move = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length],
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

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
        <button
          onClick={() => show(0)}
          className="group relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-auto"
          aria-label="Open photo gallery"
        >
          <Image
            src={images[0]}
            alt={`${name} — main photo`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
            <Expand size={14} /> View all {images.length} photos
          </span>
        </button>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-2">
          {images.slice(1, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => show(i + 1)}
              className="group relative aspect-square overflow-hidden rounded-lg"
              aria-label={`View photo ${i + 2}`}
            >
              <Image
                src={src}
                alt={`${name} — photo ${i + 2}`}
                fill
                sizes="(max-width: 640px) 25vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X />
          </button>
          <button
            onClick={() => move(-1)}
            aria-label="Previous photo"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft />
          </button>
          <div className="relative h-[80vh] w-[92vw] max-w-5xl">
            <Image
              src={images[index]}
              alt={`${name} — photo ${index + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={() => move(1)}
            aria-label="Next photo"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <ChevronRight />
          </button>
          <p className="absolute bottom-5 text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
