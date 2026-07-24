"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface Row {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  publishedAt: string | null;
}

export function BlogAdminList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
  }

  if (rows.length === 0) {
    return <p className="card p-10 text-center text-sm text-ink/50">No posts yet. Click “New post”.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-black/10 bg-cream/60 text-left text-xs uppercase tracking-wide text-ink/55">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {rows.map((p) => (
            <tr key={p.id} className="hover:bg-cream/40">
              <td className="px-4 py-3 font-medium">{p.title}</td>
              <td className="px-4 py-3 text-ink/70">{p.category}</td>
              <td className="px-4 py-3">
                <span className={`badge ${p.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {p.published && (
                    <Link href={`/blog/${p.slug}`} target="_blank" className="btn-ghost px-2 py-1.5 text-xs" title="View">
                      <ExternalLink size={14} />
                    </Link>
                  )}
                  <Link href={`/admin/blog/${p.id}`} className="btn-ghost px-2 py-1.5 text-xs"><Pencil size={14} /></Link>
                  <button onClick={() => remove(p.id)} className="btn-ghost px-2 py-1.5 text-xs text-danger"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
