"use client";

import { useState } from "react";
import { Mail, Check, Archive } from "lucide-react";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  tour: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-800",
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-black/10 text-ink/60",
};

export function MessagesList({ initial }: { initial: MessageRow[] }) {
  const [rows, setRows] = useState(initial);

  async function setStatus(id: string, status: string) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setRows(prev);
  }

  if (rows.length === 0) {
    return <div className="card p-10 text-center text-sm text-ink/50">No messages yet.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((m) => (
        <div key={m.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{m.name}</span>
                <span className={`badge ${statusColor[m.status] ?? ""}`}>{m.status}</span>
              </div>
              <p className="text-xs text-ink/55">
                <a href={`mailto:${m.email}`} className="text-brand-green hover:underline">{m.email}</a>
                {m.phone ? ` · ${m.phone}` : ""} · {new Date(m.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm font-medium text-brand-green-dark">
                {m.subject}{m.tour ? ` — ${m.tour}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-green px-3 py-2 text-xs">
                <Mail size={14} /> Reply
              </a>
              <button onClick={() => setStatus(m.id, "REPLIED")} className="btn-ghost px-3 py-2 text-xs" title="Mark replied">
                <Check size={14} />
              </button>
              <button onClick={() => setStatus(m.id, "ARCHIVED")} className="btn-ghost px-3 py-2 text-xs" title="Archive">
                <Archive size={14} />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap rounded-lg bg-cream/60 p-3 text-sm text-ink/80">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
