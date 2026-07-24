"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, ExternalLink, Star } from "lucide-react";

interface Row {
  id: string; slug: string; name: string; category: string;
  priceFromUsd: number; durationDays: number; image: string; featured: boolean;
}

export function TourAdminList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);

  async function remove(id: string) {
    if (!confirm("Delete this tour permanently?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
  }

  if (rows.length === 0) {
    return <p className="card p-10 text-center text-sm text-ink/50">No tours yet. Click “New tour”.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((t) => (
        <div key={t.id} className="card overflow-hidden">
          <div className="relative aspect-[16/9]">
            {t.image ? <Image src={t.image} alt={t.name} fill sizes="33vw" className="object-cover" /> : <div className="h-full bg-black/5" />}
            {t.featured && <span className="badge absolute left-2 top-2 bg-brand-gold text-ink"><Star size={11} /> Featured</span>}
          </div>
          <div className="p-4">
            <p className="text-xs text-ink/50">{t.category}</p>
            <h3 className="font-heading text-base text-brand-green-dark">{t.name}</h3>
            <p className="mt-1 text-sm text-ink/60">${t.priceFromUsd} · {t.durationDays} days</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/tours/${t.id}`} className="btn-green flex-1 px-3 py-2 text-xs"><Pencil size={14} /> Edit</Link>
              <Link href={`/tours/${t.slug}`} target="_blank" className="btn-ghost px-2 py-2 text-xs"><ExternalLink size={14} /></Link>
              <button onClick={() => remove(t.id)} className="btn-ghost px-2 py-2 text-xs text-danger"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
