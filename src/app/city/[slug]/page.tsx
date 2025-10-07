import { formatDateISOToID } from "@/lib/format";
import { summarizeAQ } from "@/lib/aqi";

type CityPageProps = {
  params: { slug: string };
  searchParams: { lat?: string; lon?: string; name?: string };
};

export const revalidate = 600;

async function getWeather(lat: string, lon: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/weather?lat=${lat}&lon=${lon}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("weather_failed");
  return res.json();
}

async function getAir(lat: string, lon: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/air?lat=${lat}&lon=${lon}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { slug } = params;
  const name = searchParams.name ? decodeURIComponent(searchParams.name) : slug.replaceAll("-", " ");
  const lat = searchParams.lat;
  const lon = searchParams.lon;

  if (!lat || !lon) {
    return (
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">{name}</h1>
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
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-foreground/70">
          Koordinat: {lat}, {lon} • Zona: {weather?.timezone ?? "WIB"}
        </p>
      </header>

      {/* Ringkasan sekarang */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Suhu Sekarang</h2>
          <div className="text-3xl font-semibold">{Math.round(weather.current?.temp)}°C</div>
          <div className="text-sm text-foreground/70">
            Terasa {Math.round(weather.current?.feels_like)}° • {weather.current?.label}
          </div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Angin</h2>
          <div className="text-3xl font-semibold">{Math.round(weather.current?.wind_speed)} km/j</div>
          <div className="text-sm text-foreground/70">Arah {weather.current?.wind_dir}°</div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Kelembapan & Hujan</h2>
          <div className="text-3xl font-semibold">{Math.round(weather.current?.humidity)}%</div>
          <div className="text-sm text-foreground/70">Presipitasi {weather.current?.precip ?? 0} mm</div>
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
              {aq?.dominant !== "unknown" && (
                <span className="text-xs opacity-90">• dominan {aq?.dominant.toUpperCase()}</span>
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
              {air.station ? `Stasiun: ${air.station}` : "Stasiun: —"} •{" "}
              {air.time ? `Waktu: ${new Date(air.time).toLocaleString("id-ID")}` : "Waktu: —"}
            </div>
          </div>
        )}
      </section>

      {/* Prakiraan 7 hari */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-4">Prakiraan 7 Hari</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weather.daily?.map((d: any) => (
            <li key={d.date} className="rounded-lg border border-foreground/10 p-3 bg-background">
              <div className="text-sm text-foreground/70">{formatDateISOToID(d.date)}</div>
              <div className="text-base font-medium">{d.label}</div>
              <div className="text-sm">
                <span className="font-semibold">{Math.round(d.tmax)}°</span> / {Math.round(d.tmin)}°
              </div>
              <div className="text-xs text-foreground/60">
                Hujan: {Math.round(d.rain_prob ?? 0)}% • {Math.round(d.rain_mm ?? 0)} mm
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-xs text-foreground/60">
        Pembaruan cuaca: {weather.current?.time}
      </footer>
    </main>
  );
}