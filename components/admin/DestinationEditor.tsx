"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { StringList } from "./StringList";
import { slugify } from "@/lib/slug";

export interface DestinationDraft {
  id?: string;
  name: string; slug: string; region: string; keyFact: string; overview: string;
  attractions: string[]; bestTime: string; gettingThere: string; image: string;
  lat: number; lng: number; distanceFromAddisKm: number;
}

export function DestinationEditor({ initial }: { initial: DestinationDraft }) {
  const router = useRouter();
  const [d, setD] = useState<DestinationDraft>(initial);
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (p: Partial<DestinationDraft>) => setD((prev) => ({ ...prev, ...p }));

  async function save() {
    if (!d.name.trim()) { setError("Please enter a name."); return; }
    setSaving(true); setError("");
    try {
      const res = d.id
        ? await fetch(`/api/admin/destinations/${d.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
        : await fetch("/api/admin/destinations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-3 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input" value={d.name}
              onChange={(e) => set({ name: e.target.value, ...(slugEdited ? {} : { slug: slugify(e.target.value) }) })} />
          </div>
          <div>
            <label className="label">Slug</label>
            <input className="input" value={d.slug} onChange={(e) => { setSlugEdited(true); set({ slug: slugify(e.target.value) }); }} />
          </div>
          <div>
            <label className="label">Region</label>
            <input className="input" value={d.region} onChange={(e) => set({ region: e.target.value })} />
          </div>
          <div>
            <label className="label">Distance from Addis (km)</label>
            <input type="number" className="input" value={d.distanceFromAddisKm} onChange={(e) => set({ distanceFromAddisKm: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <label className="label">Key fact (one line)</label>
          <input className="input" value={d.keyFact} onChange={(e) => set({ keyFact: e.target.value })} />
        </div>
        <div>
          <label className="label">Overview</label>
          <textarea rows={4} className="input resize-y" value={d.overview} onChange={(e) => set({ overview: e.target.value })} />
        </div>
        <div>
          <label className="label">Key attractions</label>
          <StringList items={d.attractions} onChange={(attractions) => set({ attractions })} placeholder="e.g. Church of St. George" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Best time to visit</label>
            <textarea rows={2} className="input resize-y" value={d.bestTime} onChange={(e) => set({ bestTime: e.target.value })} />
          </div>
          <div>
            <label className="label">Getting there</label>
            <textarea rows={2} className="input resize-y" value={d.gettingThere} onChange={(e) => set({ gettingThere: e.target.value })} />
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card space-y-3 p-4">
          <ImageUploader value={d.image} onChange={(image) => set({ image })} folder="destinations" label="Hero image" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Latitude</label>
              <input type="number" step="0.0001" className="input" value={d.lat} onChange={(e) => set({ lat: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input type="number" step="0.0001" className="input" value={d.lng} onChange={(e) => set({ lng: Number(e.target.value) })} />
            </div>
          </div>
          <p className="text-xs text-ink/45">Tip: find coordinates by right-clicking a spot in Google Maps.</p>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button onClick={save} disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save destination</>}
        </button>
      </aside>
    </div>
  );
}
