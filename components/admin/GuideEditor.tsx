"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { StringList } from "./StringList";
import { slugify } from "@/lib/slug";

export interface GuideDraft {
  id?: string;
  name: string; slug: string; title: string; yearsExperience: number;
  licenseNumber: string; specialties: string[]; languages: string[];
  bio: string; rating: number; image: string;
}

export function GuideEditor({ initial }: { initial: GuideDraft }) {
  const router = useRouter();
  const [d, setD] = useState<GuideDraft>(initial);
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (p: Partial<GuideDraft>) => setD((prev) => ({ ...prev, ...p }));

  async function save() {
    if (!d.name.trim()) { setError("Please enter a name."); return; }
    setSaving(true); setError("");
    try {
      const res = d.id
        ? await fetch(`/api/admin/guides/${d.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
        : await fetch("/api/admin/guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/guides");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="card space-y-3 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input" value={d.name}
              onChange={(e) => set({ name: e.target.value, ...(slugEdited ? {} : { slug: slugify(e.target.value) }) })} />
          </div>
          <div>
            <label className="label">Title / role</label>
            <input className="input" value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="Senior Cultural Guide" />
          </div>
          <div>
            <label className="label">Years of experience</label>
            <input type="number" className="input" value={d.yearsExperience} onChange={(e) => set({ yearsExperience: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">ETO license number</label>
            <input className="input" value={d.licenseNumber} onChange={(e) => set({ licenseNumber: e.target.value })} placeholder="ETO-G-0142" />
          </div>
        </div>
        <div>
          <label className="label">Short bio</label>
          <textarea rows={3} className="input resize-y" value={d.bio} onChange={(e) => set({ bio: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Specialties</label>
            <StringList items={d.specialties} onChange={(specialties) => set({ specialties })} placeholder="e.g. Lalibela" />
          </div>
          <div>
            <label className="label">Languages</label>
            <StringList items={d.languages} onChange={(languages) => set({ languages })} placeholder="e.g. English" />
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card space-y-3 p-4">
          <ImageUploader value={d.image} onChange={(image) => set({ image })} folder="guides" label="Photo" />
          <div>
            <label className="label">Rating (0–5)</label>
            <input type="number" step="0.1" min={0} max={5} className="input" value={d.rating} onChange={(e) => set({ rating: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Slug</label>
            <input className="input" value={d.slug} onChange={(e) => { setSlugEdited(true); set({ slug: slugify(e.target.value) }); }} />
          </div>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button onClick={save} disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save guide</>}
        </button>
      </aside>
    </div>
  );
}
