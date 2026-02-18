export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-neutral-800" />
          <div className="h-8 w-2/3 rounded bg-neutral-800" />
          <div className="h-64 w-full rounded-2xl bg-neutral-900" />
          <div className="h-4 w-full rounded bg-neutral-800" />
          <div className="h-4 w-5/6 rounded bg-neutral-800" />
        </div>
      </div>
    </main>
  );
}
