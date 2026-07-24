"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { TOUR_CATEGORIES } from "@/data/tours";

// §2.2 Homepage search bar — builds a query string and navigates to /tours.
const DURATIONS = [
  { label: "Any Duration", value: "" },
  { label: "1–3 Days", value: "1-3" },
  { label: "4–7 Days", value: "4-7" },
  { label: "8–14 Days", value: "8-14" },
  { label: "15+ Days", value: "15+" },
];

export function SearchBar({
  destinations,
}: {
  destinations: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (type) params.set("type", type);
    if (duration) params.set("duration", duration);
    router.push(`/tours${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid w-full max-w-5xl gap-3 rounded-2xl bg-white/95 p-4 shadow-card-hover backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <label className="sr-only" htmlFor="s-destination">
        Destination
      </label>
      <select
        id="s-destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="input"
      >
        <option value="">All Destinations</option>
        {destinations.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.name}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="s-type">
        Tour type
      </label>
      <select
        id="s-type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="input"
      >
        <option value="">All Tour Types</option>
        {TOUR_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="s-duration">
        Duration
      </label>
      <select
        id="s-duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="input"
      >
        {DURATIONS.map((d) => (
          <option key={d.label} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <button type="submit" className="btn-green w-full px-6 lg:w-auto">
        <Search size={18} /> Search
      </button>
    </form>
  );
}
