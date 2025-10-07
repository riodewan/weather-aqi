"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";

function toCityHref(slug: string, name: string, lat: number, lon: number) {
  const nameParam = encodeURIComponent(name);
  return `/city/${slug}?lat=${lat}&lon=${lon}&name=${nameParam}`;
}

export default function FavoritesGrid() {
  const { items, remove } = useFavorites();

  if (items.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        Belum ada favorit. Buka halaman kota lalu tekan “Tambah Favorit”.
      </p>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((c) => (
        <li key={c.slug} className="rounded-xl border border-foreground/10 p-4 bg-background">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-xs text-foreground/60">Lat {c.lat} • Lon {c.lon}</p>
            </div>
            <button
              onClick={() => remove(c.slug)}
              className="text-xs px-2 py-1 rounded-md border border-foreground/20 hover:bg-foreground/5"
              title="Hapus favorit"
              aria-label={`Hapus ${c.name} dari favorit`}
            >
              Hapus
            </button>
          </div>

          <Link
            className="inline-block text-sm mt-3 underline hover:no-underline"
            href={toCityHref(c.slug, c.name, c.lat, c.lon)}
          >
            Lihat detail →
          </Link>
        </li>
      ))}
    </ul>
  );
}