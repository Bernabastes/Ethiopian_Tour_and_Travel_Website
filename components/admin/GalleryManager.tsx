"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Loader2, Upload } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/data/gallery";

interface Item {
  id: string;
  url: string;
  caption: string | null;
  category: string;
  sortOrder: number;
}

export function GalleryManager({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "gallery");
        const up = await fetch("/api/admin/upload", { method: "POST", body: form });
        const upData = await up.json();
        if (!upData.ok) throw new Error(upData.error);

        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: upData.url, category }),
        });
        const { item } = await res.json();
        setItems((prev) => [...prev, item]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function patch(id: string, data: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...data } : it)));
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="card mb-6 flex flex-wrap items-end gap-3 p-5">
        <div>
          <label className="label" htmlFor="cat">Category for new uploads</label>
          <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="input w-56">
            {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label className="btn-primary cursor-pointer">
          {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading…</> : <><Upload size={18} /> Upload images</>}
          <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={uploading} />
        </label>
        <p className="text-xs text-ink/50">{items.length} images total</p>
      </div>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.id} className="card overflow-hidden">
            <div className="relative aspect-square">
              <Image src={it.url} alt={it.caption || "gallery image"} fill sizes="25vw" className="object-cover" />
              <button onClick={() => remove(it.id)} aria-label="Delete"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-danger">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="space-y-2 p-3">
              <select value={it.category} onChange={(e) => patch(it.id, { category: e.target.value })} className="input py-1.5 text-xs">
                {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input defaultValue={it.caption ?? ""} placeholder="Caption (optional)"
                onBlur={(e) => patch(it.id, { caption: e.target.value })} className="input py-1.5 text-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
