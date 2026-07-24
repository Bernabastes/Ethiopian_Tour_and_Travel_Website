"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// §4.2 Availability calendar. Falls back to a deterministic mock, but when a tour is
// selected it overlays real overrides saved by the owner in the admin dashboard.
type Status = "available" | "limited" | "full" | "off";

const API_TO_STATUS: Record<string, Status> = {
  AVAILABLE: "available",
  LIMITED: "limited",
  FULL: "full",
  OFF: "off",
};

function statusFor(date: Date, leadDays = 3): { status: Status; spots: number; isPast: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + leadDays);

  if (date < minDate) return { status: "off", spots: 0, isPast: true };

  // Deterministic pseudo-availability from day-of-year.
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const mod = dayOfYear % 10;
  if (date.getDay() === 1) return { status: "off", spots: 0, isPast: false }; // tours don't start Mondays
  if (mod === 0) return { status: "full", spots: 0, isPast: false };
  if (mod <= 2) return { status: "limited", spots: mod, isPast: false };
  return { status: "available", spots: 6 + (mod % 4), isPast: false };
}

const statusStyles: Record<Status, string> = {
  available: "bg-green-100 text-green-800 hover:bg-green-200",
  limited: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  full: "bg-red-100 text-red-400 cursor-not-allowed line-through",
  off: "bg-black/5 text-black/25 cursor-not-allowed",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function AvailabilityCalendar({
  selected,
  onSelect,
  tourSlug,
}: {
  selected?: string;
  onSelect: (iso: string) => void;
  tourSlug?: string;
}) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [overrides, setOverrides] = useState<Record<string, { status: Status; spots: number }>>({});

  // Pull owner-set availability overrides for the selected tour.
  useEffect(() => {
    if (!tourSlug) {
      setOverrides({});
      return;
    }
    let active = true;
    fetch(`/api/availability?tourSlug=${tourSlug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const map: Record<string, { status: Status; spots: number }> = {};
        for (const it of data.items ?? []) {
          map[it.date] = { status: API_TO_STATUS[it.status] ?? "available", spots: it.spots };
        }
        setOverrides(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [tourSlug]);

  const first = new Date(view.year, view.month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const shift = (dir: number) => {
    setView((v) => {
      const m = v.month + dir;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });
  };

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.year, view.month, i + 1)),
  ];

  // Local date parts (NOT toISOString, which shifts by the UTC offset) so keys
  // match the "YYYY-MM-DD" the admin saves and the API returns.
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="rounded-md p-2 hover:bg-black/5">
          <ChevronLeft size={18} />
        </button>
        <p className="font-heading text-lg text-brand-green-dark">
          {MONTHS[view.month]} {view.year}
        </p>
        <button onClick={() => shift(1)} aria-label="Next month" className="rounded-md p-2 hover:bg-black/5">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/50">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const base = statusFor(d);
          const ov = overrides[iso(d)];
          // Owner overrides win for future dates; past/lead-time dates stay off.
          const status: Status = base.isPast ? "off" : ov ? ov.status : base.status;
          const spots = ov ? ov.spots : base.spots;
          const disabled = status === "full" || status === "off";
          const isSelected = selected === iso(d);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(iso(d))}
              title={
                status === "available" || status === "limited"
                  ? `${MONTHS[d.getMonth()]} ${d.getDate()} — ${spots} spots remaining`
                  : status === "full"
                    ? "No availability — choose another date or contact us."
                    : "Tour not running"
              }
              className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                statusStyles[status]
              } ${isSelected ? "ring-2 ring-brand-green ring-offset-1" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
        <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-green-200" /> Available</span>
        <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-amber-200" /> Limited</span>
        <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-red-200" /> Fully booked</span>
        <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-black/10" /> Not running</span>
      </div>
    </div>
  );
}
