"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface Row { id: string; slug: string; name: string; region: string; image: string }

export function DestinationAdminList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  async function remove(id: string) {
    if (!confirm("Delete this destination?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
  }
  if (rows.length === 0) return <p className="card p-10 text-center text-sm text-ink/50">No destinations yet.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((dst) => (
        <div key={dst.id} className="card overflow-hidden">
          <div className="relative aspect-[16/10]">
            {dst.image ? <Image src={dst.image} alt={dst.name} fill sizes="33vw" className="object-cover" /> : <div className="h-full bg-black/5" />}
          </div>
          <div className="p-4">
            <p className="text-xs text-ink/50">{dst.region}</p>
            <h3 className="font-heading text-base text-brand-green-dark">{dst.name}</h3>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/destinations/${dst.id}`} className="btn-green flex-1 px-3 py-2 text-xs"><Pencil size={14} /> Edit</Link>
              <Link href={`/destinations/${dst.slug}`} target="_blank" className="btn-ghost px-2 py-2 text-xs"><ExternalLink size={14} /></Link>
              <button onClick={() => remove(dst.id)} className="btn-ghost px-2 py-2 text-xs text-danger"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
