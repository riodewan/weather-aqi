import { NextResponse } from "next/server";

export const revalidate = 300;

type OAQMeasurement = {
  parameter: string;
  value: number;
  unit: string;
  date: { utc: string; local: string };
  coordinates?: { latitude: number; longitude: number };
  location?: string;
  distance?: number;
};

function pickLatestByParam(items: OAQMeasurement[], param: "pm25" | "pm10") {
  const filtered = items.filter((i) => i.parameter === param);
  if (!filtered.length) return null;
  return filtered[0];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = Number(searchParams.get("radius") ?? 10000); // meter
  const limit = Number(searchParams.get("limit") ?? 50);

  if (!lat || !lon) {
    return NextResponse.json({ error: "missing_parameters" }, { status: 400 });
  }

  // Docs: https://api.openaq.org/ (v2)
  const url = new URL("https://api.openaq.org/v2/measurements");
  url.searchParams.set("coordinates", `${lat},${lon}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("parameter", "pm25,pm10");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("order_by", "datetime");
  url.searchParams.set("sort", "desc");

  try {
    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "air_fetch_failed" }, { status: 500 });
    }

    const data = await res.json();
    const items: OAQMeasurement[] = data?.results ?? [];

    const pm25 = pickLatestByParam(items, "pm25");
    const pm10 = pickLatestByParam(items, "pm10");

    const station =
      pm25?.location ?? pm10?.location ?? null;

    const coords =
      pm25?.coordinates ?? pm10?.coordinates ?? null;

    const time =
      pm25?.date?.utc ?? pm10?.date?.utc ?? null;

    return NextResponse.json(
      {
        station,
        coords,
        time,
        pm25: pm25
          ? { value: pm25.value, unit: pm25.unit, time: pm25.date.utc, distance: pm25.distance ?? null }
          : null,
        pm10: pm10
          ? { value: pm10.value, unit: pm10.unit, time: pm10.date.utc, distance: pm10.distance ?? null }
          : null,
        _source: "openaq_v2",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 500 });
  }
}