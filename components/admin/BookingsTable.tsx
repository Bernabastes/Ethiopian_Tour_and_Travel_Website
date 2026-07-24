"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";

export interface BookingRow {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  tourName: string;
  travelDate: string;
  adults: number;
  children: number;
  infants: number;
  totalUsd: number;
  depositUsd: number;
  status: string;
  createdAt: string;
}

const STATUSES = ["PENDING", "CONFIRMED", "PAID", "CANCELLED"];

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
};

function toCsv(rows: BookingRow[]) {
  const headers = [
    "Reference", "Name", "Email", "Phone", "Country", "Tour", "Travel date",
    "Adults", "Children", "Infants", "Total USD", "Deposit USD", "Status", "Created",
  ];
  const lines = rows.map((r) =>
    [
      r.reference, r.fullName, r.email, r.phone, r.country, r.tourName,
      r.travelDate.slice(0, 10), r.adults, r.children, r.infants, r.totalUsd,
      r.depositUsd, r.status, r.createdAt.slice(0, 10),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function BookingsTable({ initial }: { initial: BookingRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const visible = rows.filter(
    (r) =>
      (filter === "ALL" || r.status === filter) &&
      (query === "" ||
        `${r.fullName} ${r.email} ${r.reference} ${r.tourName}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );

  async function changeStatus(id: string, status: string) {
    setBusy(id);
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setRows(prev); // revert on failure
    setBusy(null);
  }

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, reference, tour…"
            className="input pl-9"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input h-11 w-auto">
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={exportCsv} className="btn-ghost">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-black/10 bg-cream/60 text-left text-xs uppercase tracking-wide text-ink/55">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Pax</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {visible.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-ink/50">No bookings match.</td></tr>
            ) : (
              visible.map((r) => (
                <tr key={r.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3 font-mono text-xs">{r.reference}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{r.fullName}</span>
                    <a href={`mailto:${r.email}`} className="block text-xs text-brand-green hover:underline">{r.email}</a>
                    <span className="block text-xs text-ink/45">{r.country} · {r.phone}</span>
                  </td>
                  <td className="px-4 py-3">{r.tourName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.travelDate.slice(0, 10)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">{r.adults}A {r.children}C {r.infants}I</td>
                  <td className="px-4 py-3 font-semibold">${r.totalUsd.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      disabled={busy === r.id}
                      onChange={(e) => changeStatus(r.id, e.target.value)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-semibold ${statusColor[r.status] ?? "bg-black/10"}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink/50">
        Changing a status to Confirmed, Paid or Cancelled automatically emails the customer.
      </p>
    </div>
  );
}
