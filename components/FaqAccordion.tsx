"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface QA {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {items.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-black/10 bg-white">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-brand-green/5"
            >
              <span className="flex-1 font-semibold text-ink">{qa.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-black/5 px-4 py-4 text-sm leading-relaxed text-ink/75">
                {qa.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
