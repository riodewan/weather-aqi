import { formatDateISOToID } from "@/lib/format";

type CityPageProps = {
  params: { slug: string };
  searchParams: { lat?: string; lon?: string; name?: string };
};

export const revalidate = 600;

async function getWeather(lat: string, lon: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/weather?lat=${lat}&lon=${lon}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) throw new Error("weather_failed");
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

  const weather = await getWeather(lat, lon);

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
          <div className="text-3xl font-semibold">
            {Math.round(weather.current?.temp)}°C
          </div>
          <div className="text-sm text-foreground/70">
            Terasa {Math.round(weather.current?.feels_like)}° • {weather.current?.label}
          </div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Angin</h2>
          <div className="text-3xl font-semibold">
            {Math.round(weather.current?.wind_speed)} km/j
          </div>
          <div className="text-sm text-foreground/70">Arah {weather.current?.wind_dir}°</div>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Kelembapan & Hujan</h2>
          <div className="text-3xl font-semibold">
            {Math.round(weather.current?.humidity)}%
          </div>
          <div className="text-sm text-foreground/70">
            Presipitasi {weather.current?.precip ?? 0} mm
          </div>
        </div>
      </section>

      {/* Prakiraan 7 hari */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-4">Prakiraan 7 Hari</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weather.daily?.map((d: any) => (
            <li
              key={d.date}
              className="rounded-lg border border-foreground/10 p-3 bg-background"
            >
              <div className="text-sm text-foreground/70">{formatDateISOToID(d.date)}</div>
              <div className="text-base font-medium">{d.label}</div>
              <div className="text-sm">
                <span className="font-semibold">{Math.round(d.tmax)}°</span>{" "}
                / {Math.round(d.tmin)}°
              </div>
              <div className="text-xs text-foreground/60">
                Hujan: {Math.round(d.rain_prob ?? 0)}% • {Math.round(d.rain_mm ?? 0)} mm
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Placeholder komponen lain */}
      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Kualitas Udara</h2>
        <p className="text-sm text-foreground/60">
          test
        </p>
      </section>

      <footer className="text-xs text-foreground/60">
        Pembaruan data: {weather.current?.time}
      </footer>
    </main>
  );
}