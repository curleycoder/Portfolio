import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { fetchProjects } from "@/lib/db";

export default async function ProjectPreviewCard({ count = 3 }) {
  const projects = await fetchProjects({ limit: count, offset: 0 });

  if (!projects || projects.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
            Projects
          </h2>
          <span className="text-xs text-neutral-500">No projects yet</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              className="border-neutral-800 bg-neutral-900/60 backdrop-blur"
            >
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const items = projects.slice(0, count);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-50">Projects</h2>

            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const keywords = (p.keywords || []).map((k) =>
            String(k).toLowerCase()
          );

          const isMobile =
            keywords.some((k) => k.includes("react-native")) ||
            keywords.some((k) => k.includes("expo")) ||
            keywords.some((k) => k.includes("mobile"));

          const label = isMobile ? "Mobile App" : "Web App";

          return (
            <Card
              key={p.id}
              className="
                flex h-full flex-col border-neutral-800 bg-black text-neutral-50
                shadow-[0_0_18px_rgba(15,23,42,0.9)]
              ">
              {/* CLICKABLE AREA → project details */}
              <Link
                href={`/projects/${p.id}`}
                className="group block flex-1"
              >
                {/* FRAME AREA */}
                <div className="flex items-center justify-center px-4 pt-4">
                  {isMobile ? (
                    // PHONE FRAME
                    <div className="relative flex items-center justify-center">
                      <div className="relative h-[260px] w-[120px] overflow-hidden rounded-[1.4rem] bg-neutral-900">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.0]"
                          />
                        ) : (
                          <Skeleton className="h-full w-full" />
                        )}
                      </div>
                    </div>
                  ) : (
                    // WEB BROWSER FRAME
                    <div className="relative mt-3 mb-4 w-full max-w-md overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
                      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-3 py-2 text-[10px] text-neutral-400">
                        <span className="h-2 w-2 rounded-full bg-red-500/70" />
                        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                        <span className="ml-2 truncate text-[10px] text-neutral-500">
                          {p.link?.replace(/^https?:\/\//, "") ||
                            "localhost:3000"}
                        </span>
                      </div>
                      <div className="relative h-48 w-full bg-neutral-900">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.0]"
                          />
                        ) : (
                          <Skeleton className="h-full w-full" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* TEXT INSIDE LINK */}
                <CardHeader className="space-y-1 pb-1">
                  <CardTitle className="text-base text-neutral-50">
                    {p.title}
                  </CardTitle>
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                    {label}
                  </p>
                </CardHeader>

                <CardContent className="text-sm text-neutral-200">
                  <p className="mb-2 line-clamp-3">{p.description}</p>
                </CardContent>
              </Link>

              {/* BUTTON → live site, NOT wrapped in Link */}
              <div className="px-4 pb-4 pt-1">
                <Button
                  asChild
                  className="w-full border border-blue-400/50 bg-black shadow-xl shadow-accent-foreground hover:bg-blue-400/70"
                >
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View live project
                  </a>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

    </section>
  );
}
