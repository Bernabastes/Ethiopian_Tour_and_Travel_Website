"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Review } from "@/data/types";
import { Stars } from "../ui/Stars";

// §2.6 Testimonials carousel — autoplay 6s, manual arrows, pause on hover.
export function Testimonials({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = reviews.length;

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;
  const current = reviews[Math.min(index, count - 1)];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">What Our Travellers Say</h2>
          <p className="mt-3 text-ink/70">
            Real stories from guests who explored Ethiopia with us.
          </p>
        </div>

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="card relative px-6 py-10 text-center sm:px-12">
            <Quote className="mx-auto mb-4 text-brand-gold" size={36} />
            <blockquote className="text-lg leading-relaxed text-ink/85">
              “{current.text}”
            </blockquote>
            <div className="mt-6 flex flex-col items-center gap-1">
              <Stars rating={current.rating} showNumber={false} />
              <p className="mt-2 font-semibold text-ink">
                {current.name} <span className="text-xl">{current.countryFlag}</span>
              </p>
              <p className="text-sm text-ink/55">{current.tour}</p>
            </div>
          </div>

          <button
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="absolute -left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-card hover:text-brand-green sm:-left-5"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next review"
            className="absolute -right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-card hover:text-brand-green sm:-right-5"
          >
            <ChevronRight />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-green" : "w-2 bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
