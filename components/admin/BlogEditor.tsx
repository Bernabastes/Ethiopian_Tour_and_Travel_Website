"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { BLOG_CATEGORIES } from "@/data/blog";
import { slugify } from "@/lib/slug";

export interface BlogDraft {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readMinutes: number;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

export function BlogEditor({ initial }: { initial: BlogDraft }) {
  const router = useRouter();
  const [d, setD] = useState<BlogDraft>(initial);
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (patch: Partial<BlogDraft>) => setD((prev) => ({ ...prev, ...patch }));

  function onTitle(title: string) {
    set({ title, ...(slugEdited ? {} : { slug: slugify(title) }) });
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    const payload = { ...d, published: publish ?? d.published };
    try {
      const res = d.id
        ? await fetch(`/api/admin/blog/${d.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/blog", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="b-title">Title</label>
          <input id="b-title" className="input text-lg" value={d.title} onChange={(e) => onTitle(e.target.value)} placeholder="Best Time to Visit Ethiopia" />
        </div>
        <div>
          <label className="label" htmlFor="b-slug">URL slug</label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-ink/40">/blog/</span>
            <input id="b-slug" className="input" value={d.slug}
              onChange={(e) => { setSlugEdited(true); set({ slug: slugify(e.target.value) }); }} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="b-excerpt">Excerpt (shown in listings)</label>
          <textarea id="b-excerpt" rows={2} className="input resize-y" value={d.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="b-content">Body</label>
          <textarea id="b-content" rows={18} className="input resize-y font-mono text-sm" value={d.content}
            onChange={(e) => set({ content: e.target.value })}
            placeholder={"Write your article here.\n\nUse ## for headings and blank lines between paragraphs.\nLinks: [text](/tours)"} />
          <p className="mt-1 text-xs text-ink/45">Supports simple markdown: <code>## Heading</code>, blank lines for paragraphs, <code>[link](/path)</code>.</p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card space-y-3 p-4">
          <ImageUploader value={d.coverImage} onChange={(url) => set({ coverImage: url })} folder="blog" label="Cover image (1200×630)" />
          <div>
            <label className="label" htmlFor="b-cat">Category</label>
            <select id="b-cat" className="input" value={d.category} onChange={(e) => set({ category: e.target.value })}>
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="b-author">Author</label>
            <input id="b-author" className="input" value={d.author} onChange={(e) => set({ author: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="b-read">Read time (minutes)</label>
            <input id="b-read" type="number" min={1} className="input" value={d.readMinutes} onChange={(e) => set({ readMinutes: Number(e.target.value) })} />
          </div>
        </div>

        <details className="card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink/70">SEO (optional)</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="label" htmlFor="b-mt">Meta title</label>
              <input id="b-mt" className="input" value={d.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="b-md">Meta description</label>
              <textarea id="b-md" rows={3} className="input resize-y" value={d.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} />
            </div>
          </div>
        </details>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="card space-y-2 p-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={d.published} onChange={(e) => set({ published: e.target.checked })} className="h-4 w-4 accent-brand-green" />
            Published (visible on the site)
          </label>
          <button onClick={() => save()} disabled={saving} className="btn-green w-full disabled:opacity-60">
            {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save</>}
          </button>
          {!d.published && (
            <button onClick={() => save(true)} disabled={saving} className="btn-primary w-full disabled:opacity-60">
              Save &amp; Publish
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
