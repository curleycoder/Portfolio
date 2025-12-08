// src/app/projects/[id]/page.jsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { fetchProjectById } from "@/lib/db";
import { DeleteButton } from "@/components/DeleteButton"; // or "./DeleteButton" if that's where it lives

export default async function ProjectDetailPage({ params }) {
  const { id } = params;

  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const project = await fetchProjectById(id);
  if (!project) notFound();

  const keywords = (project.keywords || []).map((k) =>
    String(k).toLowerCase()
  );
  const isMobile =
    keywords.some((k) => k.includes("react-native")) ||
    keywords.some((k) => k.includes("expo")) ||
    keywords.some((k) => k.includes("mobile"));
  const label = isMobile ? "Mobile App" : "Web App";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        {/* Back link */}
        <div>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-100"
          >
            ← Back to Projects
          </Link>
        </div>

        <Card className="border border-neutral-800 bg-neutral-900/70 text-neutral-50 p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{project.title}</h1>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
                {label}
              </p>
            </div>
          </div>

          {/* Image / preview */}
          <div className="flex justify-center">
            {isMobile ? (
              <div className="relative flex items-center justify-center">
                <div className="relative h-[320px] w-[150px] overflow-hidden rounded-[1.6rem] bg-neutral-900 border border-neutral-700/80">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                      No preview
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
                <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-neutral-400">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                  </span>
                  <span className="ml-2 truncate text-neutral-500">
                    {project.link?.replace(/^https?:\/\//, "") ||
                      "localhost:3000"}
                  </span>
                </div>
                <div className="relative h-64 w-full bg-neutral-900">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                      No preview
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Description
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-100">
                {project.description}
              </p>
            </div>

            {project.keywords?.length ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Keywords
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Live link */}
{/* ACTION ROW */}
<div className="pt-6 border-t border-neutral-800 mt-6 flex justify-end gap-3 flex-wrap">
  {/* Visit project */}
  {project.link && (
    <Button
      asChild
      size="sm"
      className="border border-blue-500/80 bg-blue-500/80 text-xs hover:bg-blue-400"
    >
      <Link href={project.link} target="_blank" rel="noreferrer">
        Visit project
      </Link>
    </Button>
  )}

  {/* Edit and delete only if logged in */}
  {isLoggedIn && (
    <>
      <Button
        asChild
        size="sm"
        variant="outline"
        className="text-xs border-neutral-600 text-black"
      >
        <Link href={`/projects/${project.id}/edit`}>Edit</Link>
      </Button>

      <DeleteButton
        id={project.id}
        size="sm"
        className="text-xs"
      />
    </>
  )}
</div>

        </Card>
      </div>
    </main>
  );
}
