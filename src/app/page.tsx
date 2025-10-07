import SearchBox from "@/components/SearchBox";
import FavoritesGrid from "@/components/FavoritesGrid";

export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Weather & Air Quality</h1>
        <p className="text-sm text-foreground/70">
          Cari kota untuk melihat cuaca & kualitas udara (MVP)
        </p>
      </header>

      <SearchBox />

      <section className="rounded-xl border border-foreground/10 p-4">
        <h2 className="font-medium mb-2">Kota Favorit</h2>
          <FavoritesGrid />
      </section>
    </main>
  );
}