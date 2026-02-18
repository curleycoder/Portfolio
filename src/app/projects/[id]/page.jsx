export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
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
      <div className="pt-2 text-xs font-mono text-neutral-500">
        {String(idx + 1).padStart(2, "0")}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/40">
        <div className="relative aspect-video w-full bg-neutral-900">
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
          <div className="border-t border-neutral-800 px-4 py-3">
            <p className="text-sm text-neutral-300 whitespace-pre-line">{caption}</p>
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
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6">
        <RevealIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-100"
          >
            <span className="opacity-70">←</span> back to projects
          </Link>
        </RevealIn>

        <RevealIn delay={0.05}>
          <Card className="relative overflow-hidden rounded-2xl border-neutral-800/90 bg-neutral-950/60">
            <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/25" />

            <div className="space-y-10 px-6 py-6 sm:px-8 sm:py-8">
              {/* HEADER */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                      case study
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-100">
                      {title}
                    </h1>

                    {shortDescription ? (
                      <p className="text-base text-neutral-300 max-w-2xl">
                        {shortDescription}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-300">
                    <span className="font-mono text-neutral-500">$</span>
                    <span className="font-mono uppercase tracking-[0.18em]">{label}</span>
                    <span className="text-neutral-700">•</span>
                    <span className="font-mono truncate max-w-[220px] text-neutral-500">
                      {linkText}
                    </span>
                  </div>
                </div>
              </header>

              {/* TECH STACK (ABOVE HERO) */}
              <RevealIn delay={0.08}>
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    tech stack
                  </h2>

                  {keywords.length ? (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((k, i) => (
                        <span
                          key={`${k}-${i}`}
                          className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 font-mono text-[10px] text-neutral-300"
                        >
                          {String(k)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      Add keywords (Expo, Hono, Drizzle, Neon, Clerk, GenAI…).
                    </p>
                  )}
                </section>
              </RevealIn>

              {/* HERO */}
              <RevealIn delay={0.1}>
                <div className="rounded-2xl bg-neutral-950/40 overflow-hidden border border-neutral-800/70">
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

              {/* BUTTONS UNDER HERO (requested) */}
              <RevealIn delay={0.12}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {project.link ? (
                      <Button asChild size="lg" className="bg-purple-600/40 text-neutral-100 hover:bg-purple-500/25">
                        <a href={project.link} target="_blank" rel="noreferrer">Visit</a>
                      </Button>
                    ) : null}

                    {project.githubLink ? (
                      <Button asChild size="sm" variant="outline" className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900">
                        <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub</a>
                      </Button>
                    ) : null}

                    {project.demoLink ? (
                      <Button asChild size="sm" variant="outline" className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900">
                        <a href={project.demoLink} target="_blank" rel="noreferrer">Demo</a>
                      </Button>
                    ) : null}

                    {project.figmaLink ? (
                      <Button asChild size="sm" variant="outline" className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900">
                        <a href={project.figmaLink} target="_blank" rel="noreferrer">Figma</a>
                      </Button>
                    ) : null}
                  </div>

                  <AdminProjectActions id={project.id} />
                </div>
              </RevealIn>

              {/* WHAT IT DOES */}
              <RevealIn delay={0.14}>
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    what it does
                  </h2>

                  {whatItDoesLines.length ? (
                    <ul className="text-sm leading-relaxed text-neutral-200 list-disc space-y-1 pl-5">
                      {whatItDoesLines.slice(0, 7).map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      Add bullets (one per line) in the editor.
                    </p>
                  )}
                </section>
              </RevealIn>

              {/* FLOW */}
              {media.length ? (
                <RevealIn delay={0.16}>
                  <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
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
                        className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4"
                      >
                        <p className="text-xs font-mono text-neutral-400">{lab}</p>
                        <p className="mt-2 text-sm text-neutral-200 whitespace-pre-line">
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
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    highlights
                  </h3>

                  {highlights.length ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {highlights.slice(0, 6).map((h, idx) => (
                        <div key={idx} className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4">
                          <p className="text-xs font-semibold text-neutral-100">
                            {h?.title || `Highlight ${idx + 1}`}
                          </p>

                          {h?.image ? (
                            <div className="mt-3">
                              <HighlightFrame
                                src={h.image}
                                title={h.title}
                                linkText={linkText}
                              />
                            </div>
                          ) : null}

                          {h?.caption ? (
                            <p className="mt-2 text-xs leading-relaxed text-neutral-300 whitespace-pre-line">
                              {h.caption}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      Add 1–5 highlight blocks (image + 1–2 line caption).
                    </p>
                  )}
                </section>
              </RevealIn>
            </div>
          </Card>
        </RevealIn>
      </div>
    </main>
  );
}
