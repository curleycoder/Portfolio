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
              className="border-neutral-800/80 bg-neutral-950/60 backdrop-blur"
            >
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const items = projects.slice(0, count);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between px-4 gap-4">
        <div className="space-y-1">
          <div className="text-[11px] pt-6 uppercase tracking-[0.22em] text-neutral-400">
            Shipped work
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
            Projects
          </h2>
        </div>

        <Link
          href="/projects"
          className="text-xs text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          /* 🔥 Robust mobile detection */
          const textBlob = [
            p.title,
            p.description,
            ...(p.keywords || []),
            p.link,
          ]
            .filter(Boolean)
            .map((v) => String(v).toLowerCase())
            .join(" ");

          const isMobile =
            /react\s*native|expo|expo\s*go|\brn\b|android|ios|mobile/.test(
              textBlob
            );

          const label = isMobile ? "Mobile" : "Web";
          const linkText = p.link?.replace(/^https?:\/\//, "") || "";

          return (
            <Card
              key={p.id}
              className="
                group relative flex h-full flex-col overflow-hidden
                rounded-2xl border border-neutral-800/80
                bg-neutral-950/60 backdrop-blur
                shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                transition-all duration-300
                hover:-translate-y-1 hover:border-neutral-700
              "
            >
              {/* whole card clickable */}
              <Link
                href={`/projects/${p.id}`}
                aria-label={`Open ${p.title}`}
                className="absolute inset-0 z-0"
              />

              <div className="relative z-10 flex flex-1 flex-col p-4">
                {/* IMAGE FRAME */}
                <div className="relative overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950">
                  {/* Mobile vs Web frame */}
                  {isMobile ? (
                    <div className="flex justify-center py-3">
                      <div className="relative w-[150px] overflow-hidden rounded-[1.6rem] border border-neutral-800 bg-neutral-950 shadow-lg">
                        <div className="relative aspect-[9/18] w-full">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <Skeleton className="h-full w-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] w-full">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </div>
                  )}

                  {/* Metadata strip */}
                  <div className="flex items-center justify-between border-t border-neutral-900 px-3 py-2 text-[11px] text-neutral-400">
                    <span className="uppercase tracking-[0.22em]">{label}</span>
                    <span className="truncate text-neutral-500">
                      {linkText || "Case study"}
                    </span>
                  </div>
                </div>

                {/* TEXT */}
                <CardHeader className="px-0 pb-2 pt-4">
                  <CardTitle className="text-base text-neutral-100">
                    {p.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 px-0 pt-0 text-sm text-neutral-300">
                  <p className="line-clamp-3">{p.description}</p>

                  {p.keywords?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.keywords || []).slice(0, 3).map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 font-mono text-[10px] text-neutral-300"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </CardContent>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">
                  <Button
                    asChild
                    className="w-full bg-purple-600/40 text-neutral-200 hover:bg-purple-500/20"
                  >
                    <Link href={`/projects/${p.id}`}>View Detail</Link>
                  </Button>

                  {/* {p.link ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                    >
                      <a href={p.link} target="_blank" rel="noreferrer">
                        Live
                      </a>
                    </Button>
                  ) : null} */}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
