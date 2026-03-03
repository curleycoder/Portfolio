"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ReactGitHubCalendar = dynamic(
  () =>
    import("react-github-calendar").then((m) => m.GitHubCalendar || m.default),
  { ssr: false }
);

export default function GitHubCalendar() {
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const isReady = () => !!el.querySelector("svg, rect, [data-level]");

    if (isReady()) {
      setLoaded(true);
      return;
    }

    const obs = new MutationObserver(() => {
      if (isReady()) {
        setLoaded(true);
        obs.disconnect();
      }
    });

    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
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
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 text-[11px] text-muted-foreground no-underline shadow-sm backdrop-blur transition hover:bg-card/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/80" />
          </span>
          <span className="group-hover:text-foreground">@curleycoder</span>
        </a>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/30 shadow-sm">
        {/* Soft top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/40 to-transparent" />

        {/* Content */}
        <div className="relative p-4">
          {/* Loader overlay */}
          {!loaded && (
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-background/55 backdrop-blur-sm">
              <div className="w-full max-w-md px-6">
                <div className="mb-3 flex items-center justify-center gap-1">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 animate-pulse rounded-[4px] bg-border"
                      style={{ animationDelay: `${i * 35}ms` }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="mx-auto h-2 w-52 animate-pulse rounded bg-border/80" />
                  <div className="mx-auto h-2 w-36 animate-pulse rounded bg-border/60" />
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Loading GitHub contributions…
                </p>
              </div>
            </div>
          )}

          {/* Scroll container */}
          <div className="overflow-x-auto">
            {/* Centering wrapper */}
            <div className="flex justify-center">
              {/* Calendar container should keep its natural width */}
              <div
                ref={wrapRef}
                className={[
                  "calendar min-w-max transition-opacity duration-500",
                  loaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <ReactGitHubCalendar
                  username="curleycoder"
                  colorScheme="dark"
                  theme={{
                    dark: [
                      "hsl(var(--muted))",
                      "hsl(var(--primary) / 0.20)",
                      "hsl(var(--primary) / 0.40)",
                      "hsl(var(--primary) / 0.65)",
                      "hsl(var(--primary) / 0.95)",
                    ],
                  }}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            </div>
          </div>

          {/* Your legend (premium + theme-matched) */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="opacity-80">Last 12 months</span>

            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {[
                  "bg-muted",
                  "bg-primary/20",
                  "bg-primary/40",
                  "bg-primary/65",
                  "bg-primary",
                ].map((c, i) => (
                  <span key={i} className={`h-3 w-3 rounded-[4px] ${c}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
          <span className="truncate">Built with react-github-calendar</span>
          <span className="font-mono text-foreground/70">Shabnam Beiraghian</span>
        </div>
      </div>
    </section>
  );
}