import { NextResponse } from "next/server";

export const revalidate = 600;

const WEATHER_CODE_LABEL: Record<number, string> = {
  0: "Cerah",
  1: "Sebagian berawan",
  2: "Berawan sebagian",
  3: "Berawan",
  45: "Berkabut",
  48: "Kabut rime",
  51: "Gerimis ringan",
  53: "Gerimis sedang",
  55: "Gerimis lebat",
  56: "Gerimis membeku ringan",
  57: "Gerimis membeku lebat",
  61: "Hujan ringan",
  63: "Hujan sedang",
  65: "Hujan lebat",
  66: "Hujan membeku ringan",
  67: "Hujan membeku lebat",
  71: "Salju ringan",
  73: "Salju sedang",
  75: "Salju lebat",
  77: "Butiran salju",
  80: "Hujan deras sesaat ringan",
  81: "Hujan deras sesaat sedang",
  82: "Hujan deras sesaat lebat",
  85: "Hujan salju ringan",
  86: "Hujan salju lebat",
  95: "Badai petir",
  96: "Badai petir disertai es kecil",
  99: "Badai petir disertai es besar",
};

function labelFromCode(code?: number) {
  if (code == null) return "—";
  return WEATHER_CODE_LABEL[code] ?? `Kode ${code}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "missing_parameters" }, { status: 400 });
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max");
  url.searchParams.set("hourly", "temperature_2m,precipitation,weather_code,wind_speed_10m");
  url.searchParams.set("timezone", "Asia/Bangkok");
  url.searchParams.set("forecast_days", "7");

  try {
    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "weather_fetch_failed" }, { status: 500 });
    }

    const data = await res.json();

    const current = {
      temp: data?.current?.temperature_2m,
      feels_like: data?.current?.apparent_temperature,
      humidity: data?.current?.relative_humidity_2m,
      precip: data?.current?.precipitation,
      wind_speed: data?.current?.wind_speed_10m,
      wind_dir: data?.current?.wind_direction_10m,
      code: data?.current?.weather_code,
      label: labelFromCode(data?.current?.weather_code),
      time: data?.current?.time,
    };

    const daily = (data?.daily?.time ?? []).map((t: string, i: number) => ({
      date: t,
      tmin: data.daily.temperature_2m_min?.[i],
      tmax: data.daily.temperature_2m_max?.[i],
      code: data.daily.weather_code?.[i],
      label: labelFromCode(data.daily.weather_code?.[i]),
      rain_mm: data.daily.precipitation_sum?.[i],
      rain_prob: data.daily.precipitation_probability_max?.[i],
    }));

    const hourly = (data?.hourly?.time ?? []).map((t: string, i: number) => ({
      time: t,
      temp: data.hourly.temperature_2m?.[i],
      rain: data.hourly.precipitation?.[i],
      code: data.hourly.weather_code?.[i],
      wind: data.hourly.wind_speed_10m?.[i],
    }));

    return NextResponse.json(
      {
        timezone: data?.timezone ?? "Asia/Bangkok",
        current,
        daily,
        hourly,
        _source: "open-meteo",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: "network_error" }, { status: 500 });
  }
}