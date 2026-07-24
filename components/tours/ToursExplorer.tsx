"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, LayoutGrid, List, Search } from "lucide-react";
import type { Tour } from "@/data/types";
import type { Filters, SortKey } from "@/lib/tourFilters";
import {
  emptyFilters,
  applyFilters,
  sortTours,
  countActive,
  PRICE_FLOOR,
  PRICE_CEIL,
} from "@/lib/tourFilters";
import { FilterControls } from "./FilterControls";
import { TourCard } from "../TourCard";
import { TourRow } from "./TourRow";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
];

const PAGE_SIZE = 9;

export function ToursExplorer({
  initial,
  tours,
  destinations,
}: {
  initial: Partial<Filters>;
  tours: Tour[];
  // DB-backed destination options, used for filter checkboxes and active tags.
  destinations: { slug: string; name: string }[];
}) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters(), ...initial });
  // DB-backed slug→name map for active filter tags and tour cards.
  const destNames = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
  const destinationName = (slug: string) => destNames[slug] ?? slug;
  const [sort, setSort] = useState<SortKey>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(
    () => sortTours(applyFilters(tours, filters), sort),
    [tours, filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const update = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  const activeCount = countActive(filters);

  // Active filter tags
  const tags: { label: string; clear: () => void }[] = [
    ...filters.destinations.map((d) => ({
      label: destinationName(d),
      clear: () => update({ ...filters, destinations: filters.destinations.filter((x) => x !== d) }),
    })),
    ...filters.durations.map((d) => ({
      label: `${d.replace("-", "–")} Days`,
      clear: () => update({ ...filters, durations: filters.durations.filter((x) => x !== d) }),
    })),
    ...filters.types.map((t) => ({
      label: t,
      clear: () => update({ ...filters, types: filters.types.filter((x) => x !== t) }),
    })),
    ...(filters.groupSize
      ? [{ label: filters.groupSize, clear: () => update({ ...filters, groupSize: "" }) }]
      : []),
    ...(filters.priceMin > PRICE_FLOOR || filters.priceMax < PRICE_CEIL
      ? [
          {
            label: `$${filters.priceMin}–${filters.priceMax >= PRICE_CEIL ? "5000+" : filters.priceMax}`,
            clear: () => update({ ...filters, priceMin: PRICE_FLOOR, priceMax: PRICE_CEIL }),
          },
        ]
      : []),
  ];

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-[88px]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl text-brand-green-dark">Filters</h2>
            {activeCount > 0 && (
              <button onClick={() => update(emptyFilters())} className="text-sm text-danger hover:underline">
                Clear all
              </button>
            )}
          </div>
          <div className="card max-h-[calc(100vh-140px)] overflow-y-auto px-5">
            <FilterControls filters={filters} setFilters={update} destinations={destinations} />
          </div>
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/70">
            Showing <strong>{paged.length}</strong> of <strong>{results.length}</strong> tours
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="btn-ghost px-3 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filter & Sort
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-brand-green px-1.5 text-xs text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="hidden items-center rounded-lg border border-black/10 sm:flex">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`flex h-10 w-10 items-center justify-center rounded-l-lg ${
                  view === "grid" ? "bg-brand-green text-white" : "text-ink/60"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`flex h-10 w-10 items-center justify-center rounded-r-lg ${
                  view === "list" ? "bg-brand-green text-white" : "text-ink/60"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input h-10 w-auto py-0 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter tags */}
        {tags.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {tags.map((t, i) => (
              <button
                key={i}
                onClick={t.clear}
                className="badge bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
              >
                {t.label} <X size={12} />
              </button>
            ))}
            <button onClick={() => update(emptyFilters())} className="text-sm text-danger hover:underline">
              Clear All
            </button>
          </div>
        )}

        {/* Results */}
        {paged.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 py-20 text-center">
            <Search size={48} className="text-ink/25" />
            <p className="text-lg font-semibold">No tours found</p>
            <p className="max-w-sm text-ink/60">
              Try adjusting your filters — or clear them to see all our Ethiopian adventures.
            </p>
            <button onClick={() => update(emptyFilters())} className="btn-green">
              Clear All Filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((t) => (
              <TourCard key={t.slug} tour={t} destNames={destNames} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paged.map((t) => (
              <TourRow key={t.slug} tour={t} destNames={destNames} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                  safePage === i + 1 ? "bg-brand-green text-white" : "border border-black/10 text-ink/70"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>

      {/* Mobile filter modal (§3.2) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-cream">
            <div className="flex items-center justify-between border-b border-black/10 p-4">
              <h2 className="font-heading text-lg text-brand-green-dark">Filter &amp; Sort</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters" className="p-2">
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="py-4">
                <label className="label" htmlFor="sort-mobile">
                  Sort by
                </label>
                <select
                  id="sort-mobile"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="input"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <FilterControls filters={filters} setFilters={update} destinations={destinations} />
            </div>
            <div className="flex gap-3 border-t border-black/10 p-4">
              <button onClick={() => update(emptyFilters())} className="btn-ghost flex-1">
                Clear
              </button>
              <button onClick={() => setMobileOpen(false)} className="btn-green flex-[2]">
                Show {results.length} tours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
