"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./MapInner";

// Client-only wrapper: Leaflet touches `window`, so load the map with ssr:false.
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black/5 text-sm text-ink/50">
      Loading map…
    </div>
  ),
});

export function MapView(props: {
  markers: MapMarker[];
  showRoute?: boolean;
  zoom?: number;
  className?: string;
}) {
  return <MapInner {...props} />;
}

export type { MapMarker };
