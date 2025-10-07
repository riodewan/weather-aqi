"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function CityMap(props: {
  lat: number;
  lon: number;
  radiusMeters?: number;
  label?: string;
  height?: number;
}) {
  return <MapView {...props} />;
}