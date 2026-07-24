"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, EyeOff, Plus, Loader2 } from "lucide-react";
import { Stars } from "@/components/ui/Stars";

interface Row {
  id: string; name: string; country: string; countryFlag: string;
  rating: number; tour: string; text: string; approved: boolean; date: string;
}

export function ReviewsManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", countryFlag: "🌍", rating: 5, tour: "", text: "" });
  const [saving, setSaving] = useState(false);

  async function toggle(id: string, approved: boolean) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, approved } : x)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved }),
    });
  }
  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
  }
  async function add() {
    if (!form.name.trim() || !form.text.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setAdding(false);
      setForm({ name: "", country: "", countryFlag: "🌍", rating: 5, tour: "", text: "" });
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setAdding((a) => !a)} className="btn-green"><Plus size={16} /> Add review</button>
      </div>

      {adding && (
        <div className="card mb-6 space-y-3 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Customer name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input className="input" placeholder="Flag emoji (🇬🇧)" value={form.countryFlag} onChange={(e) => setForm({ ...form, countryFlag: e.target.value })} />
            <input className="input" placeholder="Tour taken" value={form.tour} onChange={(e) => setForm({ ...form, tour: e.target.value })} />
            <div>
              <label className="label">Rating</label>
              <input type="number" min={1} max={5} className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
          </div>
          <textarea className="input resize-y" rows={3} placeholder="Review text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <button onClick={add} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save review"}
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="card p-10 text-center text-sm text-ink/50">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.id} className={`card p-4 ${!r.approved ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.name} <span>{r.countryFlag}</span> <span className="text-xs text-ink/50">{r.country}</span></p>
                  <Stars rating={r.rating} size={14} showNumber={false} />
                  <p className="text-xs text-ink/50">{r.tour}</p>
                </div>
                <div className="flex gap-2">
                  {r.approved ? (
                    <button onClick={() => toggle(r.id, false)} className="btn-ghost px-2 py-1.5 text-xs" title="Hide"><EyeOff size={14} /> Hide</button>
                  ) : (
                    <button onClick={() => toggle(r.id, true)} className="btn-green px-2 py-1.5 text-xs" title="Approve"><Check size={14} /> Approve</button>
                  )}
                  <button onClick={() => remove(r.id)} className="btn-ghost px-2 py-1.5 text-xs text-danger"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink/80">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
