"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { useMemo } from "react";

type Props = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
};

export default function FavoriteButton({ slug, name, lat, lon }: Props) {
  const { has, toggle } = useFavorites();

  const isFav = has(slug);
  const label = isFav ? "Hapus Favorit" : "Tambah Favorit";

  const city = useMemo(() => ({ slug, name, lat, lon }), [slug, name, lat, lon]);

  return (
    <button
      onClick={() => toggle(city)}
      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium border
        ${isFav
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground border-foreground/30 hover:border-foreground/60"
        }`}
      aria-pressed={isFav}
    >
      {isFav ? "★" : "☆"} {label}
    </button>
  );
}