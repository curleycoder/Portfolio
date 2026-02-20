export default function Loading() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-44 rounded bg-border/60" />
          <div className="h-4 w-80 rounded bg-border/55" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="
                  h-72 rounded-2xl border border-border
                  bg-card/60 backdrop-blur
                  shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
                "
              >
                <div className="pointer-events-none h-[2px] w-full bg-primary/20" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-border/60" />
                  <div className="h-3 w-full rounded bg-border/50" />
                  <div className="h-3 w-5/6 rounded bg-border/50" />
                  <div className="mt-4 h-40 w-full rounded-xl bg-border/35" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}