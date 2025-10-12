import { formatDateISOToID } from "@/lib/format";
import { summarizeAQ } from "@/lib/aqi";
import ChartTemp from "@/components/ChartTemp";
import FavoriteButton from "@/components/FavoriteButton";
import CityMap from "@/components/CityMap";
import ThemeToggle from "@/components/ThemeToggle";
import WeatherIcon from "@/components/WeatherIcon";

type CityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
};

export const revalidate = 600;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
}) {
  const { slug } = await props.params;
  const { name, lat, lon } = await props.searchParams;
  const displayName = name ? decodeURIComponent(name) : slug.replaceAll("-", " ");
  const title = `Cuaca & Kualitas Udara ${displayName} | WeatherAQI`;
  const description = `Lihat suhu sekarang, prakiraan 7 hari, dan PM2.5/PM10 untuk ${displayName}. Koordinat ${lat ?? "?"}, ${lon ?? "?"}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "id_ID" },
    twitter: { card: "summary", title, description },
  };
}

async function getWeather(lat: string, lon: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/weather?lat=${lat}&lon=${lon}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("weather_failed");
  return res.json();
}

async function getAir(lat: string, lon: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/air?lat=${lat}&lon=${lon}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CityPage(props: CityPageProps) {
  const { slug } = await props.params;
  const { lat, lon, name } = await props.searchParams;

  const displayName = name ? decodeURIComponent(name) : slug.replaceAll("-", " ");

  if (!lat || !lon) {
    return (
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">{displayName}</h1>
        <p className="text-sm text-foreground/70">Parameter lokasi tidak lengkap.</p>
      </main>
    );
  }

  const [weather, air] = await Promise.all([getWeather(lat, lon), getAir(lat, lon)]);

  const pm25Val = air?.pm25?.value ?? null;
  const pm10Val = air?.pm10?.value ?? null;
  const aq = summarizeAQ(pm25Val, pm10Val);

  const aqBg =
    aq?.level === 1 ? "bg-[--aqi-good]" :
    aq?.level === 2 ? "bg-[--aqi-moderate]" :
    aq?.level === 3 ? "bg-[--aqi-usg]" :
    aq?.level === 4 ? "bg-[--aqi-unhealthy]" :
    aq?.level === 5 ? "bg-[--aqi-very-unhealthy]" :
    aq?.level === 6 ? "bg-[--aqi-hazardous]" :
    "bg-foreground/20";

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{displayName}</h1>
            <p className="text-sm text-foreground/70">
              Koordinat: {lat}, {lon} • Zona: {weather?.timezone ?? "WIB"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <FavoriteButton
              slug={slug}
              name={displayName}
              lat={Number(lat)}
              lon={Number(lon)}
            />
          </div>
        </div>
      </header>

      {/* Ringkasan sekarang */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Suhu Sekarang</h2>
          <div className="text-3xl font-semibold">
            {weather?.current?.temp != null ? Math.round(weather.current.temp) : "—"}°C
          </div>
          <div className="text-sm text-foreground/70 flex items-center gap-2">
            <span className="inline-flex">
                <WeatherIcon code={weather?.current?.code} />
            </span>
            <span>
              Terasa {weather?.current?.feels_like != null ? Math.round(weather.current.feels_like) : "—"}° • {weather?.current?.label ?? "—"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Angin</h2>
          <div className="text-3xl font-semibold">
            {weather?.current?.wind_speed != null ? Math.round(weather.current.wind_speed) : "—"} km/jam
          </div>
          <div className="text-sm text-foreground/70">
            Arah {weather?.current?.wind_dir != null ? weather.current.wind_dir : "—"}°
          </div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Kelembapan & Hujan</h2>
          <div className="text-3xl font-semibold">
            {weather?.current?.humidity != null ? Math.round(weather.current.humidity) : "—"}%
          </div>
          <div className="text-sm text-foreground/70">
            Presipitasi {weather?.current?.precip ?? 0} mm
          </div>
        </div>
      </section>

      {/* Kualitas Udara */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-3">Kualitas Udara</h2>

        {!air ? (
          <p className="text-sm text-foreground/60">Data kualitas udara tidak tersedia saat ini.</p>
        ) : (
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 ${aqBg} text-white px-3 py-1.5 rounded-lg`}>
              <span className="text-sm font-medium">{aq?.category ?? "Tidak diketahui"}</span>
              {aq?.dominant && aq.dominant !== "unknown" && (
                <span className="text-xs opacity-90">• dominan {aq.dominant.toUpperCase()}</span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-foreground/10 p-3">
                <div className="text-xs text-foreground/60">PM2.5</div>
                <div className="text-xl font-semibold">
                  {pm25Val != null ? `${pm25Val.toFixed(1)} µg/m³` : "—"}
                </div>
              </div>
              <div className="rounded-lg border border-foreground/10 p-3">
                <div className="text-xs text-foreground/60">PM10</div>
                <div className="text-xl font-semibold">
                  {pm10Val != null ? `${pm10Val.toFixed(1)} µg/m³` : "—"}
                </div>
              </div>
            </div>

            <div className="text-xs text-foreground/60">
              {air.station ? `Stasiun: ${air.station}` : "Model berbasis grid"} •{" "}
              {air.time ? `Waktu: ${new Date(air.time).toLocaleString("id-ID")}` : "Waktu: —"}
            </div>
          </div>
        )}
      </section>

      {/* Prakiraan 7 hari */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-4">Prakiraan 7 Hari</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weather?.daily?.map((d: any) => (
            <li key={d.date} className="rounded-lg border border-foreground/10 p-3 bg-background">
              <div className="text-sm text-foreground/70">{formatDateISOToID(d.date)}</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex">
                    <WeatherIcon code={d.code} />
                </span>
                <span className="text-base font-medium">{d.label}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">
                  {d?.tmax != null ? Math.round(d.tmax) : "—"}°
                </span>{" "}
                / {d?.tmin != null ? Math.round(d.tmin) : "—"}°
              </div>
              <div className="text-xs text-foreground/60">
                Hujan: {d?.rain_prob != null ? Math.round(d.rain_prob) : 0}% • {d?.rain_mm != null ? Math.round(d.rain_mm) : 0} mm
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Grafik suhu 24 jam */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Grafik Suhu 24 Jam</h2>
        <ChartTemp
          hourly={weather?.hourly?.map((h: any) => ({ time: h.time, temp: h.temp })) ?? []}
        />
        <p className="text-xs text-foreground/60 mt-2">
          Sumber data: Open-Meteo. Waktu lokal WIB.
        </p>
      </section>

      {/* Peta */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Peta</h2>
        <CityMap
          lat={Number(lat)}
          lon={Number(lon)}
          radiusMeters={10000}
          label={displayName}
          height={360}
        />
        <p className="text-xs text-foreground/60 mt-2">
          Sumber peta: OpenStreetMap. Pin menandai koordinat kota yang dipilih.
        </p>
      </section>

      <footer className="text-xs text-foreground/60">
        Pembaruan cuaca: {weather?.current?.time ?? "—"}
      </footer>
    </main>
  );
}