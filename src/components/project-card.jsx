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
            String(k).toLowerCase(),
          );

          const isMobile =
            keywords.some((k) => k.includes("react-native")) ||
            keywords.some((k) => k.includes("expo")) ||
            keywords.some((k) => k.includes("mobile"));

          const label = isMobile ? "Mobile App" : "Web App";

          const linkText =
            p.link?.replace(/^https?:\/\//, "") || "localhost:3000";

          return (
            <Card
              key={p.id}
              className="
                group relative flex h-full flex-col overflow-hidden
                border border-neutral-800 bg-neutral-900/70 text-neutral-50
                shadow-[0_0_18px_rgba(15,23,42,0.9)]
                transition-transform transition-shadow duration-300 ease-out
                hover:-translate-y-2 hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]
              "
            >
              {/* ✅ Make the whole card clickable */}
              <Link
                href={`/projects/${p.id}`}
                aria-label={`Open ${p.title}`}
                className="absolute inset-0 z-0"
              />

              {/* CONTENT (must be above overlay for hover styles) */}
              <div className="relative z-10 flex flex-1 flex-col">
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
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
                          {linkText}
                        </span>
                      </div>
                      <div className="relative h-50 w-full bg-neutral-900">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <Skeleton className="h-full w-full" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* TEXT */}
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
              </div>

              {/* ✅ Button row ABOVE overlay, so it’s clickable */}
              <div className="relative z-10 px-4 pb-4 pt-1">
                <div className="flex gap-2">
                  {/* Internal: details page */}
                  <Button
                    asChild
                    className="w-full border border-blue-400/50 bg-black shadow-xl shadow-accent-foreground hover:bg-blue-400/70"
                  >
                    <Link href={`/projects/${p.id}`}>View more</Link>
                  </Button>
                  {/* <motion.div variants={item} className="mt-7">
                    <a
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-purple-100 ring-1 ring-purple-500/25 transition hover:bg-purple-500/22 hover:ring-purple-500/40"
                    >
                      View Projects <span className="opacity-70">→</span>
                    </a>
                  </motion.div> */}

                  {/* Optional: external live link */}
                  {/* {p.link ? (
                    <Button
                      asChild
                      variant="outline"
                      className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
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
