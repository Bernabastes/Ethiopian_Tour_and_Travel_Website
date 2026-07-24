"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, Plus } from "lucide-react";

async function uploadFile(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

/** Single image picker — shows preview, uploads on select, returns the URL. */
export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
          {value ? (
            <Image src={value} alt="preview" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink/40">No image</span>
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="animate-spin text-white" size={20} />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="btn-ghost cursor-pointer px-3 py-2 text-sm">
            <Upload size={15} /> {value ? "Replace" : "Upload"}
            <input type="file" accept="image/*" onChange={onPick} className="hidden" />
          </label>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="input py-2 text-xs"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Multi-image manager — list of images with upload + remove + reorder. */
export function MultiImageUploader({
  values,
  onChange,
  folder = "uploads",
  label = "Photos",
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, folder)));
      onChange([...values, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="group relative h-24 w-32 overflow-hidden rounded-lg border border-black/10">
            <Image src={url} alt={`photo ${i + 1}`} fill sizes="128px" className="object-cover" />
            <button type="button" onClick={() => remove(i)} aria-label="Remove"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <X size={13} />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} className="rounded bg-black/60 px-1 text-xs text-white">←</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded bg-black/60 px-1 text-xs text-white">→</button>
            </div>
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-brand-green px-1.5 py-0.5 text-[10px] font-semibold text-white">Cover</span>}
          </div>
        ))}
        <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-black/15 text-xs text-ink/50 hover:border-brand-green hover:text-brand-green">
          {busy ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          {busy ? "Uploading…" : "Add photos"}
          <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
