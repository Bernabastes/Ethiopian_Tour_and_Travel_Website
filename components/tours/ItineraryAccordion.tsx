"use client";

import { useState } from "react";
import { ChevronDown, Utensils, BedDouble } from "lucide-react";
import type { ItineraryDay } from "@/data/types";

// §3.3 Day-by-day itinerary — accordion, Day 1 open by default.
export function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number[]>([1]);

  const toggle = (day: number) =>
    setOpen((o) => (o.includes(day) ? o.filter((d) => d !== day) : [...o, day]));

  return (
    <div className="flex flex-col gap-2">
      {days.map((d) => {
        const isOpen = open.includes(d.day);
        return (
          <div key={d.day} className="overflow-hidden rounded-xl border border-black/10">
            <button
              onClick={() => toggle(d.day)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 bg-white px-4 py-4 text-left hover:bg-brand-green/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {d.day}
              </span>
              <span className="flex-1 font-heading text-base text-brand-green-dark sm:text-lg">
                {d.title}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-black/5 bg-cream/40 px-4 py-4 pl-16">
                <p className="text-sm leading-relaxed text-ink/75">{d.description}</p>
                {(d.meals || d.hotel) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/60">
                    {d.meals && (
                      <span className="inline-flex items-center gap-1">
                        <Utensils size={13} className="text-brand-green" /> {d.meals}
                      </span>
                    )}
                    {d.hotel && (
                      <span className="inline-flex items-center gap-1">
                        <BedDouble size={13} className="text-brand-green" /> {d.hotel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
