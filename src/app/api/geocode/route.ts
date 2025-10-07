import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const count = Number(searchParams.get("count") ?? 5);

  if (!q) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", String(Math.min(Math.max(count, 1), 10)));
  url.searchParams.set("language", "id");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { "accept": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "geocoding_failed" }, { status: 500 });
    }

    const data = await res.json();
    const results =
      data?.results?.map((r: any) => ({
        id: `${r.id ?? `${r.latitude},${r.longitude}`}`,
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        country: r.country,
        country_code: r.country_code,
        admin1: r.admin1,
      })) ?? [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "network_error" }, { status: 500 });
  }
}