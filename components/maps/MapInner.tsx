"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

export interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  index?: number; // numbered pin
}

// Custom numbered/branded pin via divIcon (avoids broken default marker asset paths).
function pin(index?: number) {
  const inner = index != null ? `${index}` : "●";
  return L.divIcon({
    className: "",
    html: `<div style="
        background:#1B6B3A;color:#fff;width:28px;height:28px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 6px rgba(0,0,0,.35);border:2px solid #C8A84B;">
        <span style="transform:rotate(45deg);font:700 12px/1 Inter,sans-serif;">${inner}</span>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export default function MapInner({
  markers,
  showRoute = false,
  zoom = 6,
  className = "h-full w-full",
}: {
  markers: MapMarker[];
  showRoute?: boolean;
  zoom?: number;
  className?: string;
}) {
  const center: [number, number] = markers.length
    ? [
        markers.reduce((s, m) => s + m.lat, 0) / markers.length,
        markers.reduce((s, m) => s + m.lng, 0) / markers.length,
      ]
    : [9.0108, 38.7613];

  const line: [number, number][] = markers.map((m) => [m.lat, m.lng]);

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showRoute && line.length > 1 && (
        <Polyline positions={line} pathOptions={{ color: "#C8A84B", weight: 3, dashArray: "6 8" }} />
      )}
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={pin(m.index)}>
          {m.label && <Popup>{m.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}
