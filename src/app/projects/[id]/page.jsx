export const revalidate = 3600;

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchProjectById } from "@/lib/db";
import GallerySlider from "@/components/GallerySlider";
import HighlightFrame from "@/components/HighlightFrame";
import RevealIn from "@/components/motions/RevealIn";
import AdminProjectActions from "@/components/AdminProjectActions";

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr || []) {
    if (!item) continue;
    const v = String(item).trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function splitLines(s) {
  return String(s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function FlowStep({ step, idx }) {
  const type = step?.type === "video" ? "video" : "image";
  const src = String(step?.src ?? "").trim();
  const caption = String(step?.caption ?? "").trim();
  if (!src) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
      <div className="pt-2 text-xs font-mono text-muted-foreground/80">
        {String(idx + 1).padStart(2, "0")}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="relative aspect-video w-full bg-background/30">
          {type === "video" ? (
            <video
              className="h-full w-full object-cover"
              src={src}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`step-${idx + 1}`} className="h-full w-full object-cover" />
          )}
        </div>

        {caption ? (
          <div className="border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }) {
  const id = params?.id;
  if (!id) notFound();

  const project = await fetchProjectById(id);
  if (!project) notFound();

  const title = String(project.title ?? "").trim();
  const shortDescription = String(project.shortDescription ?? "").trim();

  const whatItDoesLines = splitLines(project.description);

  const keywords = Array.isArray(project.keywords) ? project.keywords : [];
  const imagesExtra = Array.isArray(project.images) ? project.images : [];
  const heroImages = dedupe([project.image, ...imagesExtra].filter(Boolean));

  const highlights = Array.isArray(project.highlights) ? project.highlights : [];
  const media = Array.isArray(project.media) ? project.media : [];

  const blob = [title, shortDescription, project.description, ...keywords, project.link]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(" ");

  const isMobile = /react\s*native|expo|expo\s*go|\brn\b|android|ios|mobile/.test(blob);

  const linkText = project.link?.replace(/^https?:\/\//, "") || "case study";
  const label = isMobile ? "mobile" : "web";

  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-6">
      <RevealIn>
        <Link
          href="/projects"
          className="
            inline-flex items-center gap-2 text-xs font-mono
            text-muted-foreground hover:text-foreground
            no-underline
          "
        >
          <span className="opacity-70">←</span> back to projects
        </Link>
      </RevealIn>

      <RevealIn delay={0.05}>
        <section
          className="
            relative overflow-hidden rounded-2xl border border-border
            bg-card/70 text-card-foreground backdrop-blur
            shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          "
        >
          {/* micro accent line */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

          <div className="space-y-10 p-5 sm:p-6 lg:p-8">
            {/* HEADER */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    case study
                  </div>

                  <h1 className="font-heading text-4xl sm:text-5xl leading-[1.02] tracking-[-0.02em]">
                    {title}
                  </h1>

                  {shortDescription ? (
                    <p className="text-base text-muted-foreground max-w-2xl">
                      {shortDescription}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/35 px-3 py-2 text-[11px]">
                  <span className="font-mono text-muted-foreground/70">$</span>
                  <span className="font-mono uppercase tracking-[0.18em] text-foreground">
                    {label}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-mono truncate max-w-[220px] text-muted-foreground/80">
                    {linkText}
                  </span>
                </div>
              </div>
            </header>

            {/* TECH STACK */}
            <RevealIn delay={0.08}>
              <section className="space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  tech stack
                </h2>

                {keywords.length ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((k, i) => (
                      <span
                        key={`${k}-${i}`}
                        className="rounded-full border border-border bg-background/35 px-2.5 py-1 font-mono text-[10px] text-foreground/90"
                      >
                        {String(k)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add keywords (Expo, Hono, Drizzle, Neon, Auth0…).
                  </p>
                )}
              </section>
            </RevealIn>

            {/* HERO */}
            <RevealIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-border bg-background/25">
                <GallerySlider
                  title={title}
                  isMobile={isMobile}
                  linkText={linkText}
                  images={heroImages}
                  showControlsWhenSingle
                  className="w-full"
                />
              </div>
            </RevealIn>

            {/* BUTTONS */}
            <RevealIn delay={0.12}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {project.link ? (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 border border-border no-underline"
                    >
                      <a href={project.link} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    </Button>
                  ) : null}

                  {project.githubLink ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-border bg-transparent text-foreground hover:bg-accent/60 no-underline"
                    >
                      <a href={project.githubLink} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </Button>
                  ) : null}

                  {project.demoLink ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-border bg-transparent text-foreground hover:bg-accent/60 no-underline"
                    >
                      <a href={project.demoLink} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    </Button>
                  ) : null}

                  {project.figmaLink ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-border bg-transparent text-foreground hover:bg-accent/60 no-underline"
                    >
                      <a href={project.figmaLink} target="_blank" rel="noreferrer">
                        Figma
                      </a>
                    </Button>
                  ) : null}
                </div>

                <AdminProjectActions id={project.id} />
              </div>
            </RevealIn>

            {/* WHAT IT DOES */}
            <RevealIn delay={0.14}>
              <section className="space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  what it does
                </h2>

                {whatItDoesLines.length ? (
                  <ul className="space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 [&>li]:list-item list-disc">
                    {whatItDoesLines.slice(0, 7).map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add bullets (one per line) in the editor.
                  </p>
                )}
              </section>
            </RevealIn>

            {/* FLOW */}
            {media.length ? (
              <RevealIn delay={0.16}>
                <section className="space-y-4">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    how it works
                  </h2>

                  <div className="space-y-7">
                    {media.map((step, idx) => (
                      <FlowStep key={idx} step={step} idx={idx} />
                    ))}
                  </div>
                </section>
              </RevealIn>
            ) : null}

            {/* RATIONALE */}
            <RevealIn delay={0.18}>
              <section className="space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  rationale
                </h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Context", project.rationaleProblem],
                    ["Requirements", project.rationaleChallenge],
                    ["Outcome", project.rationaleSolution],
                  ].map(([lab, txt]) => (
                    <div
                      key={lab}
                      className="rounded-2xl border border-border bg-background/25 p-4"
                    >
                      <p className="text-xs font-mono text-muted-foreground">{lab}</p>
                      <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">
                        {String(txt || "").trim() || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </RevealIn>

            {/* HIGHLIGHTS */}
            <RevealIn delay={0.2}>
              <section className="space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  highlights
                </h3>

                {highlights.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {highlights.slice(0, 6).map((h, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border bg-background/25 p-4"
                      >
                        <p className="text-xs font-semibold text-foreground">
                          {h?.title || `Highlight ${idx + 1}`}
                        </p>

                        {h?.image ? (
                          <div className="mt-3">
                            <HighlightFrame src={h.image} title={h.title} linkText={linkText} />
                          </div>
                        ) : null}

                        {h?.caption ? (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                            {h.caption}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add 1–5 highlight blocks (image + 1–2 line caption).
                  </p>
                )}
              </section>
            </RevealIn>
          </div>
        </section>
      </RevealIn>

      <div className="h-10" />
    </div>
  );
}