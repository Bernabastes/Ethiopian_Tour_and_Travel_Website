"use client";

import { Plus, Trash2 } from "lucide-react";

// Reusable editor for a list of plain strings (attractions, languages, specialties…).
export function StringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((val, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="input py-2 text-sm"
            value={val}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="btn-ghost px-2 text-danger" aria-label="Remove"><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="btn-ghost px-3 py-1.5 text-xs">
        <Plus size={14} /> Add
      </button>
    </div>
  );
}
