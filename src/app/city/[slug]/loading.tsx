export default function LoadingCity() {
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-64 bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-40 bg-foreground/10 rounded animate-pulse" />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-foreground/10 p-4 space-y-2">
            <div className="h-4 w-28 bg-foreground/10 rounded animate-pulse" />
            <div className="h-8 w-24 bg-foreground/10 rounded animate-pulse" />
            <div className="h-4 w-36 bg-foreground/10 rounded animate-pulse" />
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-foreground/10 p-4">
        <div className="h-4 w-40 bg-foreground/10 rounded animate-pulse mb-3" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-foreground/10 p-3 space-y-2">
              <div className="h-3 w-24 bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse" />
              <div className="h-3 w-20 bg-foreground/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-foreground/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-foreground/10 p-4">
        <div className="h-4 w-40 bg-foreground/10 rounded animate-pulse mb-3" />
        <div className="h-72 w-full bg-foreground/10 rounded animate-pulse" />
      </section>
    </main>
  );
}