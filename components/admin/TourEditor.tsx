"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { MultiImageUploader } from "./ImageUploader";
import { TOUR_CATEGORIES } from "@/data/tours";
import { slugify } from "@/lib/slug";

const DIFFICULTIES = ["Easy", "Moderate", "Challenging"];

interface Day { day: number; title: string; description: string; meals?: string; hotel?: string }
interface Tier { label: string; usd: number | null; note?: string }
interface Stop { name: string; lat: number; lng: number }

export interface TourDraft {
  id?: string;
  name: string; slug: string; category: string; difficulty: string;
  durationDays: number; durationNights: number; priceFromUsd: number;
  rating: number; reviewCount: number; groupSizeMax: number;
  startLocation: string; endLocation: string; featured: boolean;
  destinations: string[]; shortDescription: string; description: string[];
  highlights: string[]; images: string[]; itinerary: Day[];
  included: string[]; excluded: string[]; pricing: Tier[]; route: Stop[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-5">
      <legend className="px-2 font-heading text-lg text-brand-green-dark">{title}</legend>
      <div className="mt-2 space-y-3">{children}</div>
    </fieldset>
  );
}

/** Editable list of plain strings. */
function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((val, i) => (
        <div key={i} className="flex gap-2">
          <input className="input py-2 text-sm" value={val} placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="btn-ghost px-2 text-danger" aria-label="Remove"><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="btn-ghost px-3 py-1.5 text-xs">
        <Plus size={14} /> Add
      </button>
    </div>
  );
}

export function TourEditor({
  initial,
  destinations,
}: {
  initial: TourDraft;
  // DB-backed destination options (slug + display name) for the checkbox list.
  destinations: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [d, setD] = useState<TourDraft>(initial);
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (p: Partial<TourDraft>) => setD((prev) => ({ ...prev, ...p }));

  function onName(name: string) {
    set({ name, ...(slugEdited ? {} : { slug: slugify(name) }) });
  }

  // Itinerary helpers
  const addDay = () => set({ itinerary: [...d.itinerary, { day: d.itinerary.length + 1, title: "", description: "" }] });
  const setDay = (i: number, patch: Partial<Day>) =>
    set({ itinerary: d.itinerary.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const removeDay = (i: number) =>
    set({ itinerary: d.itinerary.filter((_, j) => j !== i).map((x, k) => ({ ...x, day: k + 1 })) });

  // Pricing helpers
  const addTier = () => set({ pricing: [...d.pricing, { label: "", usd: 0 }] });
  const setTier = (i: number, patch: Partial<Tier>) =>
    set({ pricing: d.pricing.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const removeTier = (i: number) => set({ pricing: d.pricing.filter((_, j) => j !== i) });

  // Route helpers
  const addStop = () => set({ route: [...d.route, { name: "", lat: 9.0, lng: 38.7 }] });
  const setStop = (i: number, patch: Partial<Stop>) =>
    set({ route: d.route.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const removeStop = (i: number) => set({ route: d.route.filter((_, j) => j !== i) });

  async function save() {
    if (!d.name.trim()) { setError("Please enter a tour name."); return; }
    setSaving(true);
    setError("");
    try {
      const res = d.id
        ? await fetch(`/api/admin/tours/${d.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
        : await fetch("/api/admin/tours", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/tours");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  const numField = (label: string, key: keyof TourDraft, min = 0) => (
    <div>
      <label className="label">{label}</label>
      <input type="number" min={min} className="input" value={d[key] as number}
        onChange={(e) => set({ [key]: Number(e.target.value) } as Partial<TourDraft>)} />
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Basics */}
      <Section title="Basics">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Tour name</label>
            <input className="input" value={d.name} onChange={(e) => onName(e.target.value)} placeholder="Lalibela Rock-Hewn Churches Discovery" />
          </div>
          <div>
            <label className="label">URL slug</label>
            <input className="input" value={d.slug} onChange={(e) => { setSlugEdited(true); set({ slug: slugify(e.target.value) }); }} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={d.category} onChange={(e) => set({ category: e.target.value })}>
              {TOUR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="input" value={d.difficulty} onChange={(e) => set({ difficulty: e.target.value })}>
              {DIFFICULTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {numField("Price from (USD)", "priceFromUsd")}
          {numField("Duration (days)", "durationDays", 1)}
          {numField("Duration (nights)", "durationNights")}
          {numField("Max group size", "groupSizeMax", 1)}
          {numField("Rating (0–5)", "rating")}
          {numField("Review count", "reviewCount")}
          <div>
            <label className="label">Start location</label>
            <input className="input" value={d.startLocation} onChange={(e) => set({ startLocation: e.target.value })} />
          </div>
          <div>
            <label className="label">End location</label>
            <input className="input" value={d.endLocation} onChange={(e) => set({ endLocation: e.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.featured} onChange={(e) => set({ featured: e.target.checked })} className="h-4 w-4 accent-brand-green" />
          Featured on homepage
        </label>
      </Section>

      {/* Destinations */}
      <Section title="Destinations">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {destinations.map((dest) => (
            <label key={dest.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-brand-green"
                checked={d.destinations.includes(dest.slug)}
                onChange={() => set({ destinations: d.destinations.includes(dest.slug)
                  ? d.destinations.filter((s) => s !== dest.slug)
                  : [...d.destinations, dest.slug] })} />
              {dest.name}
            </label>
          ))}
        </div>
      </Section>

      {/* Photos */}
      <Section title="Photos">
        <MultiImageUploader values={d.images} onChange={(images) => set({ images })} folder="tours" label="Tour photos (first = main/hero)" />
      </Section>

      {/* Description */}
      <Section title="Description">
        <div>
          <label className="label">Short description (1 line, used on cards)</label>
          <input className="input" value={d.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
        </div>
        <label className="label">Full description (paragraphs)</label>
        <StringList items={d.description} onChange={(description) => set({ description })} placeholder="A paragraph of the overview…" />
        <label className="label mt-3">Highlights</label>
        <StringList items={d.highlights} onChange={(highlights) => set({ highlights })} placeholder="e.g. All 11 UNESCO churches" />
      </Section>

      {/* Itinerary */}
      <Section title="Day-by-day itinerary">
        {d.itinerary.map((day, i) => (
          <div key={i} className="rounded-lg border border-black/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-green"><GripVertical size={14} /> Day {day.day}</span>
              <button type="button" onClick={() => removeDay(i)} className="text-danger" aria-label="Remove day"><Trash2 size={14} /></button>
            </div>
            <input className="input mb-2 py-2 text-sm" placeholder="Day title" value={day.title} onChange={(e) => setDay(i, { title: e.target.value })} />
            <textarea className="input mb-2 resize-y py-2 text-sm" rows={2} placeholder="What happens this day" value={day.description} onChange={(e) => setDay(i, { description: e.target.value })} />
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input py-2 text-sm" placeholder="Meals (e.g. Breakfast, Lunch)" value={day.meals ?? ""} onChange={(e) => setDay(i, { meals: e.target.value })} />
              <input className="input py-2 text-sm" placeholder="Hotel / camp" value={day.hotel ?? ""} onChange={(e) => setDay(i, { hotel: e.target.value })} />
            </div>
          </div>
        ))}
        <button type="button" onClick={addDay} className="btn-ghost px-3 py-1.5 text-xs"><Plus size={14} /> Add day</button>
      </Section>

      {/* Inclusions */}
      <Section title="What's included / not included">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Included</label>
            <StringList items={d.included} onChange={(included) => set({ included })} placeholder="e.g. Domestic flights" />
          </div>
          <div>
            <label className="label">Not included</label>
            <StringList items={d.excluded} onChange={(excluded) => set({ excluded })} placeholder="e.g. International flights" />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing tiers">
        {d.pricing.map((t, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_1fr_auto] items-center gap-2">
            <input className="input py-2 text-sm" placeholder="Group size (e.g. 2–3 persons)" value={t.label} onChange={(e) => setTier(i, { label: e.target.value })} />
            <input className="input py-2 text-sm" type="number" placeholder="USD" value={t.usd ?? ""}
              onChange={(e) => setTier(i, { usd: e.target.value === "" ? null : Number(e.target.value) })} />
            <input className="input py-2 text-sm" placeholder="Note (e.g. per person / contact us)" value={t.note ?? ""} onChange={(e) => setTier(i, { note: e.target.value })} />
            <button type="button" onClick={() => removeTier(i)} className="text-danger" aria-label="Remove tier"><Trash2 size={14} /></button>
          </div>
        ))}
        <p className="text-xs text-ink/45">Leave USD blank for “contact for quote”.</p>
        <button type="button" onClick={addTier} className="btn-ghost px-3 py-1.5 text-xs"><Plus size={14} /> Add tier</button>
      </Section>

      {/* Route */}
      <Section title="Route map stops">
        {d.route.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_110px_110px_auto] items-center gap-2">
            <input className="input py-2 text-sm" placeholder="Stop name" value={s.name} onChange={(e) => setStop(i, { name: e.target.value })} />
            <input className="input py-2 text-sm" type="number" step="0.0001" placeholder="Lat" value={s.lat} onChange={(e) => setStop(i, { lat: Number(e.target.value) })} />
            <input className="input py-2 text-sm" type="number" step="0.0001" placeholder="Lng" value={s.lng} onChange={(e) => setStop(i, { lng: Number(e.target.value) })} />
            <button type="button" onClick={() => removeStop(i)} className="text-danger" aria-label="Remove stop"><Trash2 size={14} /></button>
          </div>
        ))}
        <button type="button" onClick={addStop} className="btn-ghost px-3 py-1.5 text-xs"><Plus size={14} /> Add stop</button>
      </Section>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-3 border-t border-black/10 bg-white/90 px-6 py-3 backdrop-blur">
        {error ? <p className="text-sm text-danger">{error}</p> : <span className="text-xs text-ink/50">{d.id ? "Editing" : "New tour"}</span>}
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save tour</>}
        </button>
      </div>
    </div>
  );
}
