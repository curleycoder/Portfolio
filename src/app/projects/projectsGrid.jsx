"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectsGrid({ initialProjects }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  const allTags = useMemo(() => {
    const s = new Set();
    projects.forEach((p) => {
      (p.keywords ?? []).forEach((k) => {
        if (k && typeof k === "string") {
          s.add(k.trim());
        }
      });
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return projects.filter((p) => {
      const title = (p.title ?? "").toLowerCase();
      const description = (p.description ?? "").toLowerCase();
      const keywords = (p.keywords ?? []).map((k) =>
        String(k).toLowerCase()
      );

      const matchesSearch =
        !q ||
        title.includes(q) ||
        description.includes(q) ||
        keywords.some((k) => k.includes(q));

      const matchesTag =
        activeTag === "all" ||
        (p.keywords ?? []).some(
          (k) =>
            k &&
            typeof k === "string" &&
            k.trim().toLowerCase() === activeTag.toLowerCase()
        );

      return matchesSearch && matchesTag;
    });
  }, [projects, search, activeTag]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 sm:p-5">
        {/* Search */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or tech…"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 sm:max-w-md"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Filter by tag
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className={[
                "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em]",
                activeTag === "all"
                  ? "border-blue-500/80 bg-blue-500/20 text-blue-100"
                  : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500",
              ].join(" ")}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setActiveTag((prev) =>
                    prev.toLowerCase() === tag.toLowerCase() ? "all" : tag
                  )
                }
                className={[
                  "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em]",
                  activeTag.toLowerCase() === tag.toLowerCase()
                    ? "border-blue-500/80 bg-blue-500/20 text-blue-100"
                    : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500",
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-neutral-500">
        Showing{" "}
        <span className="font-semibold text-neutral-100">
          {filtered.length}
        </span>{" "}
        of {projects.length} projects
      </p>

      {/* Grid */}
      <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const keywords = (p.keywords || []).map((k) =>
            String(k).toLowerCase()
          );

          const isMobile =
            keywords.some((k) => k.includes("react-native")) ||
            keywords.some((k) => k.includes("expo")) ||
            keywords.some((k) => k.includes("mobile"));

          const label = isMobile ? "Mobile App" : "Web App";

          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
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
                    <div className="relative flex w-32 sm:w-36 justify-center">
                      <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.4rem] bg-neutral-900">
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
                  ) : (
                    // WEB BROWSER FRAME
                    <div className="relative mt-2 mb-4 w-full overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
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
                      <div className="relative aspect-[16/9] w-full bg-neutral-900">
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
                        <button
                          key={k}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTag(k);
                          }}
                          className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-300 hover:bg-neutral-700"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* Visual only; card link handles navigation */}
                    <Button
                      type="button"
                      size="sm"
                      className="pointer-events-none border border-blue-500/80 text-xs"
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-sm text-neutral-300">
          No projects match your search and filters.
          <span className="mt-1 block text-xs text-neutral-500">
            Try clearing the search or selecting a different tag.
          </span>
        </div>
      )}
    </div>
  );
}
