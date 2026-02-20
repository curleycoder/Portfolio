export default function Loading() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div
          className="
            animate-pulse space-y-4
            rounded-2xl border border-border
            bg-card/60 backdrop-blur
            p-5 sm:p-6
            shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          "
        >
          <div className="h-3 w-44 rounded bg-border/70" />
          <div className="h-8 w-2/3 rounded bg-border/60" />
          <div className="h-64 w-full rounded-2xl bg-border/40" />
          <div className="h-3 w-full rounded bg-border/60" />
          <div className="h-3 w-5/6 rounded bg-border/60" />
        </div>
      </div>
    </div>
  );
}