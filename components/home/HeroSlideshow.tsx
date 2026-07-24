"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// §2.1 Hero slideshow — full-bleed crossfading photos of Ethiopia's signature
// destinations with an alternating Ken Burns pan/zoom. Auto-advances every
// SLIDE_INTERVAL ms; honours prefers-reduced-motion (no drift, no auto-play).

export type HeroSlide = { src: string; alt: string };

const SLIDE_INTERVAL = 7000; // 7s — within the requested 6–8s window.

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    // Skip auto-rotation when the user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {slides.map((slide, i) => {
        const isActive = i === active;
        // Alternate drift direction so consecutive slides move opposite ways.
        const kenBurns = i % 2 === 0 ? "animate-ken-burns-ltr" : "animate-ken-burns-rtl";
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              // First image is LCP-critical; lazy-load the rest.
              priority={i === 0}
              sizes="100vw"
              // Ken Burns runs continuously but is paused while off-screen so it
              // resumes seamlessly (no transform jump during the crossfade) and
              // costs nothing on hidden slides.
              className={`object-cover will-change-transform ${kenBurns} ${
                isActive ? "[animation-play-state:running]" : "[animation-play-state:paused]"
              } motion-reduce:animate-none motion-reduce:transform-none`}
            />
          </div>
        );
      })}
    </div>
  );
}
