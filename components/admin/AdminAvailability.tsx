"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface TourOpt { slug: string; name: string }
type Status = "AVAILABLE" | "LIMITED" | "FULL" | "OFF";

const CYCLE: Status[] = ["AVAILABLE", "LIMITED", "FULL", "OFF"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const styles: Record<Status, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  LIMITED: "bg-amber-100 text-amber-800",
  FULL: "bg-red-100 text-red-700",
  OFF: "bg-black/10 text-ink/40",
};

export function AdminAvailability({ tours }: { tours: TourOpt[] }) {
  const [tourSlug, setTourSlug] = useState(tours[0]?.slug ?? "");
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [overrides, setOverrides] = useState<Record<string, Status>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!tourSlug) return;
    setLoading(true);
    const res = await fetch(`/api/availability?tourSlug=${tourSlug}`);
    const data = await res.json();
    const map: Record<string, Status> = {};
    for (const it of data.items ?? []) map[it.date] = it.status;
    setOverrides(map);
    setLoading(false);
  }, [tourSlug]);

  useEffect(() => { load(); }, [load]);

  const shift = (dir: number) =>
    setView((v) => {
      const m = v.month + dir;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  const first = new Date(view.year, view.month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.year, view.month, i + 1)),
  ];
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const defaultStatus = (d: Date): Status => (d.getDay() === 1 ? "OFF" : "AVAILABLE");

  async function cycle(d: Date) {
    const key = iso(d);
    const current = overrides[key] ?? defaultStatus(d);
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    setOverrides((o) => ({ ...o, [key]: next }));
    setSaving(key);
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tourSlug, date: key, status: next }),
    });
    setSaving(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-xl">
      <label className="label" htmlFor="av-tour">Tour</label>
      <select id="av-tour" value={tourSlug} onChange={(e) => setTourSlug(e.target.value)} className="input mb-4">
        {tours.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
      </select>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => shift(-1)} className="rounded-md p-2 hover:bg-black/5" aria-label="Previous month"><ChevronLeft size={18} /></button>
          <p className="font-heading text-lg text-brand-green-dark">
            {MONTHS[view.month]} {view.year} {loading && <Loader2 size={14} className="ml-1 inline animate-spin" />}
          </p>
          <button onClick={() => shift(1)} className="rounded-md p-2 hover:bg-black/5" aria-label="Next month"><ChevronRight size={18} /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/50">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const past = d < today;
            const status = overrides[iso(d)] ?? defaultStatus(d);
            return (
              <button
                key={i}
                disabled={past || saving === iso(d)}
                onClick={() => cycle(d)}
                className={`aspect-square rounded-md text-sm font-medium ${past ? "bg-black/5 text-black/20" : styles[status]} ${saving === iso(d) ? "opacity-50" : ""}`}
                title={past ? "Past date" : `${status} — click to change`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-green-200" /> Available</span>
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-amber-200" /> Limited</span>
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-red-200" /> Full</span>
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded bg-black/10" /> Not running</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink/50">Click a date to cycle its status. Changes save instantly.</p>
    </div>
  );
}
