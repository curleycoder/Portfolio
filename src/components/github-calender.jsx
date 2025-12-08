"use client";

import { useEffect, useState } from "react";
import "github-calendar/dist/github-calendar.css";

export default function GitHubCalendar() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    import("github-calendar")
      .then((module) => {
        if (!isMounted) return;
        const GitHubCalendar = module.default;

        GitHubCalendar(".calendar", "curleycoder", {
          responsive: true,
        });

        setTimeout(() => {
          if (isMounted) setLoaded(true);
        }, 600);
      })
      .catch((err) => {
        console.error("GitHubCalendar error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative rounded-3xl bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-purple-500/40 p-[1px] shadow-[0_0_40px_rgba(34,211,238,0.35)]">
      {/* Inner dark card */}
      <div className="rounded-3xl border border-neutral-900 bg-neutral-950/95 p-4 md:p-5">
        {/* HEADER / STATUS BAR */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs text-cyan-300">
              ⬛
            </span>
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.2em]">
                GitHub Activity
              </span>
              <span className="text-[10px] text-neutral-500">
                Recent contribution heatmap
              </span>
            </div>
          </div>

          <button
            type="button"
            className="
              inline-flex items-center gap-1 rounded-full border border-neutral-700/80
              bg-neutral-900/80 px-3 py-1 text-[11px] text-neutral-200
              transition-colors duration-200 hover:border-cyan-500/70 hover:bg-neutral-900
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>@curleycoder</span>
          </button>
        </div>

        {/* CALENDAR WRAPPER */}
        <div className="relative mt-1 overflow-x-autop-3 text-xs text-neutral-300">
          {/* Loading overlay / skeleton */}
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-neutral-900/90 backdrop-blur-sm">
              <div className="flex gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 animate-pulse rounded-[4px] bg-neutral-700/80"
                    style={{ animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-neutral-400">
                Loading your commits…
              </p>
            </div>
          )}

          {/* GitHub Calendar target */}
          <div className="calendar min-w-[600px]" />
        </div>

        {/* FOOTER LEGEND */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-500">
          <span>Built with github-calendar · dark themed</span>
          <div className="flex items-center gap-1">
            <span className="mr-1">Less</span>
            <span className="h-3 w-3 rounded-[4px] bg-neutral-800" />
            <span className="h-3 w-3 rounded-[4px] bg-green-900" />
            <span className="h-3 w-3 rounded-[4px] bg-green-700" />
            <span className="h-3 w-3 rounded-[4px] bg-green-500" />
            <span className="h-3 w-3 rounded-[4px] bg-green-300" />
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
