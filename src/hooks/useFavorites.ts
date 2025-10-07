"use client";

import { useEffect, useMemo, useState } from "react";

export type FavCity = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
};

const KEY = "weather_aqi_favorites_v1";

export function useFavorites() {
  const [items, setItems] = useState<FavCity[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const has = (slug: string) => items.some((c) => c.slug === slug);

  const add = (city: FavCity) =>
    setItems((prev) => (prev.some((c) => c.slug === city.slug) ? prev : [city, ...prev]));

  const remove = (slug: string) =>
    setItems((prev) => prev.filter((c) => c.slug !== slug));

  const toggle = (city: FavCity) => (has(city.slug) ? remove(city.slug) : add(city));

  return useMemo(
    () => ({ items, add, remove, toggle, has }),
    [items]
  );
}