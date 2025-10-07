"use client";

export default function CityError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Gagal memuat data kota</h1>
      <p className="text-sm text-foreground/70">{error.message || "Terjadi kesalahan tak terduga."}</p>
      <button
        onClick={reset}
        className="inline-flex items-center rounded-lg bg-foreground/90 text-background px-3 py-2 text-sm font-medium hover:bg-foreground"
      >
        Coba lagi
      </button>
    </main>
  );
}