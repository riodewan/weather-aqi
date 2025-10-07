"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GeocodeSuggestion } from "@/app/types/geocode";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<GeocodeSuggestion[]>([]);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  // Debounce query: 250ms
  useEffect(() => {
    if (!q.trim()) {
      setItems([]);
      setErr(null);
      return;
    }

    setLoading(true);
    setErr(null);

    const controller = new AbortController();
    abortRef.current?.abort(); // batalkan request sebelumnya
    abortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}&count=5`, {
          signal: controller.signal,
          headers: { accept: "application/json" },
          cache: "no-store", // cari selalu realtime
        });
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setItems(data.results ?? []);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setErr("Gagal mengambil saran kota");
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q]);

  const onPick = (s: GeocodeSuggestion) => {
    const slug = toSlug(`${s.name}-${s.admin1 ?? ""}-${s.country_code ?? ""}`);
    const nameParam = encodeURIComponent(
      [s.name, s.admin1, s.country].filter(Boolean).join(", ")
    );
    router.push(`/city/${slug}?lat=${s.lat}&lon=${s.lon}&name=${nameParam}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items[0]) onPick(items[0]);
  };

  const dropdownVisible = useMemo(() => q.trim().length > 0, [q]);

  return (
    <div className="space-y-2">
      <form onSubmit={onSubmit} className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kota (contoh: Bogor)…"
          className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="Cari kota"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 h-[38px] rounded-lg px-4 bg-foreground/90 text-background text-sm font-medium hover:bg-foreground"
          disabled={loading || items.length === 0}
        >
          {loading ? "Mencari…" : "Cari"}
        </button>
      </form>

      {dropdownVisible && (
        <div className="rounded-xl border border-foreground/10 overflow-hidden">
          {err ? (
            <div className="px-4 py-3 text-sm text-red-500">{err}</div>
          ) : loading && items.length === 0 ? (
            <ul className="divide-y divide-foreground/10">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="px-4 py-3">
                  <div className="h-4 w-40 bg-foreground/10 rounded mb-1 animate-pulse" />
                  <div className="h-3 w-24 bg-foreground/10 rounded animate-pulse" />
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <div className="px-4 py-3 text-sm text-foreground/60">
              Tidak ada hasil untuk “{q}”.
            </div>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="px-4 py-3 hover:bg-foreground/5 cursor-pointer"
                  onClick={() => onPick(s)}
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-foreground/60">
                    {[s.admin1, s.country].filter(Boolean).join(", ")} • {s.lat}, {s.lon}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}