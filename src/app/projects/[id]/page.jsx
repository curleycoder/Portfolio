export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { fetchProjectById } from "@/lib/db";
import { DeleteButton } from "@/components/DeleteButton";
import GallerySlider from "@/components/GallerySlider";

function wordCount(s) {
  return String(s || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

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

export default async function ProjectPage({ params }) {
  const id = params?.id;
  if (!id) notFound();

  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const project = await fetchProjectById(id);
  if (!project) notFound();

  const keywords = (project.keywords || []).map((k) => String(k).toLowerCase());
  const isMobile =
    keywords.some((k) => k.includes("react-native")) ||
    keywords.some((k) => k.includes("expo")) ||
    keywords.some((k) => k.includes("mobile"));

  const extraImages = Array.isArray(project.images) ? project.images : [];
  const heroImages = dedupe([project.image, ...extraImages].filter(Boolean));
  const linkText = project.link?.replace(/^https?:\/\//, "") || "localhost:3000";

  const label = isMobile ? "Mobile App" : "Web App";

  const rationaleText = String(project.rationale ?? "").trim();
  const wc = wordCount(rationaleText);

  const highlights = Array.isArray(project.highlights) ? project.highlights : [];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
        <div>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-100"
          >
            ← Back to Projects
          </Link>
        </div>

        <Card className="space-y-6 border border-neutral-800 bg-neutral-900/70 p-6 text-neutral-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{project.title}</h1>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
                {label}
              </p>
            </div>
          </div>

          {/* ✅ Slider preview: mobile frame OR web browser frame */}
          <GallerySlider
            title={project.title}
            isMobile={isMobile}
            linkText={linkText}
            images={heroImages}
            showControlsWhenSingle
            className="w-full"
          />

          {/* Rationale */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Rationale
            </h2>

            {rationaleText ? (
              <>
                <p className="text-sm leading-relaxed text-neutral-100">
                  {rationaleText}
                </p>
                <p className="text-[11px] text-neutral-500">
                  Word count: {wc} (target: 100–150)
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-300">
                Add a 100–150 word rationale in third person (general-audience tone).
              </p>
            )}
          </section>

          {/* Highlights */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Highlights
            </h3>

            {highlights.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.slice(0, 5).map((h, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3"
                  >
                    <p className="text-xs font-semibold text-neutral-100">
                      {h.title || `Highlight ${idx + 1}`}
                    </p>

                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {h.image ? (
                        <img
                          src={h.image}
                          alt={h.title || project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    {h.caption ? (
                      <p className="text-xs leading-relaxed text-neutral-300">
                        {h.caption}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-300">
                Add 3–5 highlight blocks (each with an image + 1–2 line caption).
              </p>
            )}
          </section>

          {/* Links + admin actions */}
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-neutral-800 pt-6">
            {project.link && (
              <Button
                asChild
                size="sm"
                className="border border-blue-500/80 bg-blue-500/80 text-xs hover:bg-blue-400"
              >
                <a href={project.link} target="_blank" rel="noreferrer">
                  Visit project
                </a>
              </Button>
            )}

            {isLoggedIn && (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-xs border-neutral-700 text-neutral-800 hover:bg-neutral-900"
                >
                  <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                </Button>

                <DeleteButton id={project.id} size="sm" className="text-xs" />
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
