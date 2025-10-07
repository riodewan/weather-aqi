type CityPageProps = {
  params: { slug: string };
  searchParams: { lat?: string; lon?: string; name?: string };
};

export default function CityPage({ params, searchParams }: CityPageProps) {
  const { slug } = params;
  const { lat, lon, name } = searchParams;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {name ? decodeURIComponent(name) : slug.replaceAll("-", " ")}
        </h1>
        <p className="text-sm text-foreground/70">
          Koordinat: {lat ?? "?"}, {lon ?? "?"}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Ringkasan Cuaca</h2>
          <p className="text-sm text-foreground/60">
            (Nanti diisi suhu sekarang, kondisi, angin.)
          </p>
        </div>

        <div className="rounded-xl border border-foreground/10 p-4">
          <h2 className="font-medium mb-2">Kualitas Udara</h2>
          <p className="text-sm text-foreground/60">
            (Nanti diisi PM2.5/PM10 + kategori.)
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Prakiraan 7 Hari</h2>
        <p className="text-sm text-foreground/60">
          (Nanti kartu harian + ikon.)
        </p>
      </section>

      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Grafik</h2>
        <p className="text-sm text-foreground/60">
          (Nanti grafik suhu 24 jam.)
        </p>
      </section>

      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Peta</h2>
        <p className="text-sm text-foreground/60">
          (Nanti peta lokasi + stasiun AQ terdekat.)
        </p>
      </section>
    </main>
  );
}
