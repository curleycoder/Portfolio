// src/app/projects/page.jsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { fetchProjects } from "@/lib/db";
import ProjectsGrid from "./ProjectsGrid";

const LIMIT = 50;

export default async function ProjectsPage() {
  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const projects = await fetchProjects({ limit: LIMIT, offset: 0 });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-50">
              Projects
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              These are the projects powering your homepage preview.
            </p>
          </div>

          {isLoggedIn && (
            <Button
              asChild
              className="border border-blue-400/50 bg-blue-500/80 text-xs shadow-lg shadow-blue-900/50 hover:bg-blue-400"
            >
              <Link href="/projects/new">+ Add Project</Link>
            </Button>
          )}
        </div>

        {/* Search, filter, and grid (client side) */}
        <ProjectsGrid initialProjects={projects ?? []} />
      </div>
    </main>
  );
}
