import Link from "next/link";
import { fetchProjects } from "@/lib/db";
import HighlightFrame from "@/components/HighlightFrame";

function isMobileProject(p) {
  const blob = [
    p?.title,
    p?.shortDescription,
    p?.description,
    ...(p?.keywords ?? []),
    p?.link,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(" ");

  return /react\s*native|expo|expo\s*go|\brn\b|android|ios|mobile/.test(blob);
}

function WorkTile({ p, index }) {
  const mobile = isMobileProject(p);
  const year = p?.year || "2025"; // optional if you don’t have it
  const subtitle = p?.shortDescription || p?.description || "";
  const frameMode = mobile ? "mobile" : "web";

  // stagger like hen-ry: left down, right up, repeat
  const offsetClass =
    index % 2 === 0
      ? "lg:translate-y-10"
      : "lg:-translate-y-6";

  return (
    <Link
      href={`/projects/${p.id}`}
      className={[
        "group block no-underline",
        "rounded-3xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
      aria-label={`Open ${p.title}`}
    >
      <div
        className={[
          "relative rounded-3xl border border-border/50",
          "bg-card/35 backdrop-blur-xl",
          "shadow-[0_18px_60px_-40px_rgba(0,0,0,0.55)]",
          "transition-transform duration-300",
          "group-hover:scale-[1.01]",
          offsetClass,
        ].join(" ")}
      >
        {/* outer “ghost frame” like hen-ry */}
        <div className="pointer-events-none absolute inset-4 rounded-3xl border border-border/30" />

        {/* inner content */}
        <div className="p-5 sm:p-7">
          {/* Frame (mobile or web) */}
          <div className="rounded-3xl overflow-hidden bg-background/20">
            <HighlightFrame
              src={p.image}
              title={p.title}
              linkText={(p?.link || "").replace(/^https?:\/\//, "") || "case study"}
              forceMode={frameMode}
            />
          </div>

          {/* Text below */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>

              {/* year pill */}
              <span className="ml-auto rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs text-muted-foreground">
                {year}
              </span>
            </div>

            {subtitle ? (
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {subtitle}
              </p>
            ) : null}

            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.18em]">View</span>
              <span className="opacity-70 group-hover:opacity-100">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ProjectPreviewCard({ count = 2 }) {
  const projects = await fetchProjects({ limit: count, offset: 0 });
  if (!projects || projects.length === 0) return null;

  const items = projects.slice(0, count);

  return (
    <section className="space-y-8">
      {/* Header row */}
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Work
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Selected Projects
          </h2>
        </div>

        <Link
          href="/projects"
          className="
            inline-flex items-center rounded-xl px-3 py-2 text-xs
            text-muted-foreground transition
            border border-border/60 bg-card/30
            hover:bg-accent/60 hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
          "
        >
          View all →
        </Link>
      </div>

      {/* Hen-ry style layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {items.map((p, idx) => (
          <WorkTile key={p.id} p={p} index={idx} />
        ))}
      </div>
    </section>
  );
}