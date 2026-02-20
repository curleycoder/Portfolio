export const revalidate = 3600;

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { fetchProjects } from "@/lib/db";
import ProjectsGrid from "./projectsGrid";

const LIMIT = 50;

export default async function ProjectsPage() {
  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const projects = await fetchProjects({ limit: LIMIT, offset: 0 });

  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Work
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl leading-[1.02] tracking-[-0.02em]">
              Projects
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              A curated set of shipped work—focused on accessible UI, clean architecture,
              and reliable delivery.
            </p>
          </div>

          {isLoggedIn && (
            <Button
              asChild
              className="
                rounded-xl px-4 py-2 text-sm font-semibold
                bg-primary text-primary-foreground
                hover:opacity-90
                border border-border
                no-underline
                shadow-sm
              "
            >
              <Link href="/projects/new">+ Add Project</Link>
            </Button>
          )}
        </div>

        {/* Divider line (hen-ry-ish) */}
        <div className="h-px w-full bg-border" />
      </section>

      {/* Grid (client side) */}
      <section
      >
        <div className="p-5 sm:p-6">
          <ProjectsGrid initialProjects={projects ?? []} />
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}