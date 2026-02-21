
export const revalidate = 3600;


import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { auth0 } from "@/lib/auth0";
import { fetchProjectById } from "@/lib/db";
import RevealIn from "@/components/motions/RevealIn";
import EditProjectForm from "@/components/EditForm"; // <-- your existing good form

export default async function EditProjectPage({ params }) {
  const id = params?.id;
  if (!id) notFound();

  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 md:px-6">
          <RevealIn>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-100"
            >
              <span className="opacity-70">←</span> back to projects
            </Link>
          </RevealIn>

          <RevealIn delay={0.05}>
            <Card className="rounded-2xl border border-neutral-800/90 bg-neutral-950/60 p-6">
              <p className="text-sm text-neutral-200">
                You must be logged in to edit projects.
              </p>
            </Card>
          </RevealIn>
        </div>
      </main>
    );
  }

const project = await fetchProjectById(id);
  if (!project) notFound();

  const linkText = project.link?.replace(/^https?:\/\//, "") || "case study";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 md:px-6">
        {/* Back */}
        <RevealIn>
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-100"
          >
            <span className="opacity-70">←</span> back to case study
          </Link>
        </RevealIn>

        {/* Main card (same as your ProjectPage vibe) */}
        <RevealIn delay={0.05}>
          <Card className="relative overflow-hidden rounded-2xl border-neutral-800/90 bg-neutral-950/60">
            {/* micro accent */}
            <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/30" />
            <div className="pointer-events-none absolute left-80 top-0 h-0.5 w-20 bg-purple-400/30" />
            <span className="mt-0.2 mx-6 h-3 w-3 rounded-full bg-purple-600/80 opacity-70" />

            <div className="sm:px-6 space-y-4">
              {/* Header */}
              <header className="space-y-1 px-6 sm:px-0 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                      edit
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
                      {project.title}
                    </h1>
                  </div>

                  {/* terminal-style meta pill */}
                  <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-300">
                    <span className="font-mono text-neutral-500">$</span>
                    <span className="font-mono uppercase tracking-[0.18em]">
                      edit
                    </span>
                    <span className="text-neutral-700">•</span>
                    <span className="font-mono truncate max-w-[180px] text-neutral-500">
                      {linkText}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-neutral-400">
                  Update the content that powers your portfolio cards.
                </p>
              </header>

              {/* Form body */}
              <div className="px-6 sm:px-0 pb-6">
                {/* ✅ IMPORTANT: pass the whole project (includes id) */}
                <EditProjectForm key={project.id} project={project} id={id} />

              </div>
            </div>
          </Card>
        </RevealIn>
      </div>
    </main>
  );
}
