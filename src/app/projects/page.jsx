import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";
import { auth0 } from "@/lib/auth0";

import {
  ensureProjectsTable,
  seedProjectsTable,
  fetchProjects,
} from "@/lib/db";
import { PROJECT_SEED } from "@/lib/project-seed";

const LIMIT = 50; // or whatever you want

export default async function ProjectsPage() {
  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  // 🔹 talk directly to DB, NOT /api/projects
  await ensureProjectsTable();
  await seedProjectsTable(PROJECT_SEED);

  const projects = await fetchProjects({ limit: LIMIT, offset: 0 });

  return (
    <div className="p-6 space-y-4">
      {/* Top bar with optional Add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>

        {isLoggedIn && (
          <Button asChild>
            <Link href="/projects/new">Add Project</Link>
          </Button>
        )}
      </div>

      {/* Grid of cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const slug = createSlug(p.title);
          return (
            <Card
              key={slug}
              className="p-4 group hover:scale-105 transition-transform"
            >
              <h3 className="font-semibold mb-2">{p.title}</h3>
              <Image
                src={p.image}
                alt={p.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {p.description}
              </p>
              <div className="flex gap-2 mt-3">
                <Button asChild size="sm" variant="secondary">
                  <a href={p.link} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/projects/${slug}`}>Details</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
