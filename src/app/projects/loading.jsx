export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-neutral-800" />
          <div className="h-4 w-72 rounded bg-neutral-800" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-neutral-900" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
