import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "missing_parameters" }, { status: 400 });
  }

  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "pm10,pm2_5,us_aqi");
  url.searchParams.set("hourly", "pm10,pm2_5,us_aqi");
  url.searchParams.set("timezone", "Asia/Bangkok");

  try {
    const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "openmeteo_air_failed", body: text }, { status: 502 });
    }
    const data = await res.json();

    const curTime = data?.current?.time ?? null;
    const pm25Val = data?.current?.pm2_5 ?? null;
    const pm10Val = data?.current?.pm10 ?? null;

    return NextResponse.json(
      {
        station: null,
        coords: { latitude: Number(lat), longitude: Number(lon) },
        time: curTime,
        pm25: pm25Val != null ? { value: pm25Val, unit: "µg/m³", time: curTime, distance: null } : null,
        pm10: pm10Val != null ? { value: pm10Val, unit: "µg/m³", time: curTime, distance: null } : null,
        hourly: data?.hourly ?? null,
        _source: "openmeteo_air",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: "network_error", message: String(e?.message ?? e) }, { status: 500 });
  }
}