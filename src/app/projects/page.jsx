import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";
import { auth0 } from "@/lib/auth0";
import { fetchProjects } from "@/lib/db";

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

        {/* Grid of cards */}
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const slug = createSlug(p.title);
            const keywords = (p.keywords || []).map((k) =>
              String(k).toLowerCase()
            );

            const isMobile =
              keywords.includes("react-native") ||
              keywords.includes("expo") ||
              keywords.includes("mobile");

            const label = isMobile ? "Mobile App" : "Web App";

            return (
              <Link
                key={p.id}
                href={`/projects/${slug}`}
                className="group block h-full"
              >
                <Card
                  className="
                    flex h-full flex-col overflow-hidden
                    border border-neutral-800 bg-neutral-900/70 text-neutral-50
                    shadow-[0_0_18px_rgba(15,23,42,0.9)]
                    transition-transform transition-shadow duration-200 ease-out
                    group-hover:-translate-y-2 group-hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]
                  "
                >
                  {/* Frame area */}
                  <div className="flex items-center justify-center px-4 pt-4">
                    {isMobile ? (
                      // PHONE FRAME
                      <div className="relative flex items-center justify-center">
                        <div className="relative h-[260px] w-[120px] overflow-hidden rounded-[1.4rem]">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform duration-200 group-hover:scale-[1.0]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                              No preview
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // WEB BROWSER FRAME
                      <div className="relative mt-2 mb-4 w-full max-w-md overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 ">
                        {/* Fake browser toolbar */}
                        <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-neutral-400">
                          <span className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-500/70" />
                            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                          </span>
                          <span className="ml-2 truncate text-neutral-500">
                            {p.link?.replace(/^https?:\/\//, "") ||
                              "localhost:3000"}
                          </span>
                        </div>
                        {/* Site preview */}
                        <div className="relative h-48 w-full bg-neutral-900">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
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

                  {/* Text + actions */}
                  <div className="flex flex-1 flex-col px-4 pb-4">
                    <h3 className="text-base font-semibold text-neutral-50">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                      {label}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm text-neutral-200">
                      {p.description}
                    </p>

                    {p.keywords?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.keywords.map((k) => (
                          <span
                            key={k}
                            className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="opacity-80">View details</span>
                      <span className="translate-x-0 transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
