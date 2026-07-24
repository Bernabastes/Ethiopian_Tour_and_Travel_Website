"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

interface Row { id: string; name: string; title: string; image: string; licenseNumber: string }

export function GuideAdminList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  async function remove(id: string) {
    if (!confirm("Delete this guide?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
  }
  if (rows.length === 0) return <p className="card p-10 text-center text-sm text-ink/50">No guides yet.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((g) => (
        <div key={g.id} className="card flex items-center gap-3 p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            {g.image ? <Image src={g.image} alt={g.name} fill sizes="64px" className="object-cover" /> : <div className="h-full bg-black/5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-base text-brand-green-dark">{g.name}</h3>
            <p className="truncate text-xs text-ink/55">{g.title}</p>
            <p className="truncate text-[11px] text-brand-green">{g.licenseNumber}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Link href={`/admin/guides/${g.id}`} className="btn-ghost px-2 py-1.5 text-xs"><Pencil size={14} /></Link>
            <button onClick={() => remove(g.id)} className="btn-ghost px-2 py-1.5 text-xs text-danger"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
