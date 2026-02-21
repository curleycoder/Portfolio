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
        const GitHubCalendarLib = module.default;

        GitHubCalendarLib(".calendar", "curleycoder", { responsive: true });

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
    <section className="relative">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent contribution heatmap
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            GitHub Activity
          </h2>
        </div>

        <a
          href="https://github.com/curleycoder"
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex items-center gap-2 rounded-full
            border border-border bg-card/30 px-3 py-1.5
            text-[11px] text-muted-foreground
            transition hover:bg-accent/60 hover:text-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
            no-underline
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
          <span>@curleycoder</span>
        </a>
      </div>

      {/* calendar wrapper */}
      <div className="relative overflow-x-auto p-3">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/65 backdrop-blur-sm">
            <div className="flex gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 w-3 animate-pulse rounded-[4px] bg-border"
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Loading commits…</p>
          </div>
        )}

        <div className="calendar w-full" />
      </div>

      {/* footer note */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span>Built with github-calendar</span>
        <span className="font-mono">Shabnam Beiraghian</span>
      </div>
    </section>
  );
}