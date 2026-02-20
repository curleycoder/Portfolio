export default function ResumePdfPage() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Resume
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em]">
            Resume (PDF)
          </h1>
        </div>

        <a
          href="/resume.pdf"
          className="
            inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold
            bg-primary text-primary-foreground border border-border
            transition hover:opacity-90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
            no-underline
          "
        >
          Download
        </a>
      </header>

      <section
        className="
          relative overflow-hidden rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
        "
      >
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

        <div className="h-[78vh] w-full bg-background/25">
          <embed
            src="/resume.pdf#view=FitH"
            type="application/pdf"
            className="h-full w-full"
          />
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}