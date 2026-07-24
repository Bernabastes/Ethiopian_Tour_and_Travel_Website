"use client";

import type { Filters } from "@/lib/tourFilters";
import { PRICE_FLOOR, PRICE_CEIL } from "@/lib/tourFilters";
import { TOUR_CATEGORIES } from "@/data/tours";
import { formatUsd } from "@/lib/format";

const DURATIONS = [
  { value: "1-3", label: "1–3 Days" },
  { value: "4-7", label: "4–7 Days" },
  { value: "8-14", label: "8–14 Days" },
  { value: "15+", label: "15+ Days" },
];

const GROUP_SIZES = [
  { value: "solo", label: "Solo Traveler" },
  { value: "small", label: "Small Group (2–6)" },
  { value: "medium", label: "Medium Group (7–15)" },
  { value: "large", label: "Large Group (16+)" },
  { value: "private", label: "Private Tour" },
];

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/10 py-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/70">{title}</h3>
      {children}
    </div>
  );
}

export function FilterControls({
  filters,
  setFilters,
  destinations,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  // DB-backed destination options (slug + display name).
  destinations: { slug: string; name: string }[];
}) {
  const patch = (p: Partial<Filters>) => setFilters({ ...filters, ...p });

  return (
    <div>
      {/* Destination */}
      <FilterSection title="Destination">
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {destinations.map((d) => (
            <label key={d.slug} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.destinations.includes(d.slug)}
                onChange={() => patch({ destinations: toggle(filters.destinations, d.slug) })}
                className="h-4 w-4 accent-brand-green"
              />
              {d.name}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duration">
        <div className="space-y-2">
          {DURATIONS.map((d) => (
            <label key={d.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.durations.includes(d.value)}
                onChange={() => patch({ durations: toggle(filters.durations, d.value) })}
                className="h-4 w-4 accent-brand-green"
              />
              {d.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price range (§3.2 dual-handle slider + manual inputs) */}
      <FilterSection title="Price Range (per person)">
        <div className="mb-3 flex items-center justify-between text-sm font-semibold text-brand-green">
          <span>{formatUsd(filters.priceMin)}</span>
          <span>
            {filters.priceMax >= PRICE_CEIL ? `${formatUsd(PRICE_CEIL)}+` : formatUsd(filters.priceMax)}
          </span>
        </div>
        <div className="relative h-6">
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMin}
            onChange={(e) =>
              patch({ priceMin: Math.min(Number(e.target.value), filters.priceMax - 50) })
            }
            className="pointer-events-none absolute z-20 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-green"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMax}
            onChange={(e) =>
              patch({ priceMax: Math.max(Number(e.target.value), filters.priceMin + 50) })
            }
            className="pointer-events-none absolute z-20 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-green"
            aria-label="Maximum price"
          />
          <div className="absolute top-1.5 h-1 w-full rounded bg-black/15" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            min={PRICE_FLOOR}
            max={filters.priceMax - 50}
            onChange={(e) => patch({ priceMin: Number(e.target.value) || 0 })}
            className="input py-2 text-sm"
            aria-label="Minimum price input"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            value={filters.priceMax}
            min={filters.priceMin + 50}
            max={PRICE_CEIL}
            onChange={(e) => patch({ priceMax: Number(e.target.value) || PRICE_CEIL })}
            className="input py-2 text-sm"
            aria-label="Maximum price input"
          />
        </div>
      </FilterSection>

      {/* Tour type */}
      <FilterSection title="Tour Type">
        <div className="space-y-2">
          {TOUR_CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.types.includes(c)}
                onChange={() => patch({ types: toggle(filters.types, c) })}
                className="h-4 w-4 accent-brand-green"
              />
              {c}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Group size (§3.2 SHOULD) */}
      <FilterSection title="Group Size">
        <div className="space-y-2">
          {GROUP_SIZES.map((g) => (
            <label key={g.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="groupSize"
                checked={filters.groupSize === g.value}
                onChange={() => patch({ groupSize: g.value })}
                className="h-4 w-4 accent-brand-green"
              />
              {g.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
