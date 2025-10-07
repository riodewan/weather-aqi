"use client";

import { useEffect, useMemo, useRef } from "react";
import L, { Map as LeafletMap } from "leaflet";

type MapViewProps = {
  lat: number;
  lon: number;
  radiusMeters?: number;
  label?: string;
  height?: number;
};

export default function MapView({
  lat,
  lon,
  radiusMeters = 10000,
  label = "Lokasi kota",
  height = 320,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const center = useMemo<[number, number]>(() => [lat, lon], [lat, lon]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 11,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
    }).addTo(map);

    const marker = L.circleMarker(center, { radius: 8 }).addTo(map);
    marker.bindPopup(
      `<div style="font-size:12px">
        <div style="font-weight:600;margin-bottom:4px">${label}</div>
        <div>Lat: ${lat}</div>
        <div>Lon: ${lon}</div>
      </div>`
    );

    let circle: L.Circle | null = null;
    if (radiusMeters > 0) {
      circle = L.circle(center, {
        radius: radiusMeters,
        fillOpacity: 0.05,
      }).addTo(map);
    }

    return () => {
      marker.remove();
      circle?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(center, map.getZoom());
  }, [center]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-foreground/10"
      style={{ height }}
    />
  );
}