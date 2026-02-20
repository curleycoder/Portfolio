"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ---------- helpers ---------- */

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:image");
}

function isMobileProject(p) {
  const blob = [
    p?.title,
    p?.shortDescription,
    p?.description,
    ...(p?.keywords ?? []),
    p?.link,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(" ");

  return /react\s*native|expo|expo\s*go|\brn\b|android|ios|mobile/.test(blob);
}

function safeText(v) {
  return String(v ?? "").trim();
}

function stripProtocol(url) {
  return String(url || "").replace(/^https?:\/\//, "") || "case study";
}

/* ---------- frames ---------- */

function PhoneFrame({ src, alt }) {
  const safe = safeText(src);

  return (
    <div className="relative mx-auto w-[210px] max-w-full">
      <div className="relative overflow-hidden rounded-[28px] bg-background/20 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />

        <div className="relative aspect-[9/19] w-full bg-black/15">
          {safe ? (
            <Image
              src={safe}
              alt={alt}
              fill
              className="object-cover"
              unoptimized={isDataUrl(safe)}
              sizes="210px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No preview
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function BrowserFrame({ src, alt, linkText }) {
  const safe = safeText(src);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-background/20 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-border/40 bg-background/30 px-3 py-2 text-[10px] text-muted-foreground">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500/70" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
        </span>
        <span className="ml-2 flex-1 truncate opacity-80">{linkText}</span>
      </div>

      <div className="relative aspect-[16/10] w-full bg-black/10">
        {safe ? (
          <Image
            src={safe}
            alt={alt}
            fill
            className="object-contain"
            unoptimized={isDataUrl(safe)}
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No preview
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}

/* ---------- tile ---------- */

function ProjectTile({ p, idx }) {
  const mobile = isMobileProject(p);
  const subtitle = safeText(p?.shortDescription || p?.description);
  const linkText = stripProtocol(p?.link);

  // stagger (messy / hen-ry-ish)
  const stagger =
    idx % 3 === 0
      ? "lg:-translate-y-6"
      : idx % 3 === 1
      ? "lg:translate-y-12"
      : "lg:translate-y-2";

  // sizing difference: mobile is taller
  const frameMin =
    mobile ? "min-h-[420px] sm:min-h-[480px]" : "min-h-[260px] sm:min-h-[320px]";

  return (
    <Link
      href={`/projects/${p.id}`}
      className={[
        "group block no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        stagger,
      ].join(" ")}
    >
      <div
        className={[
          "relative h-full overflow-hidden rounded-[28px]",
          "border border-border/50 bg-card/35 backdrop-blur-xl",
          "shadow-[0_18px_60px_-40px_rgba(0,0,0,0.55)]",
          "transition-transform duration-300 group-hover:scale-[1.01]",
        ].join(" ")}
      >
        {/* inner outline + glow */}
        <div className="pointer-events-none absolute inset-5 rounded-[24px] " />
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative p-5 sm:p-7">
          {/* FRAME */}
          <div
            className={[
              " p-2 overflow-hidden",
              frameMin,
            ].join(" ")}
          >
            {mobile ? (
              <PhoneFrame src={p.image} alt={p.title} />
            ) : (
              <BrowserFrame src={p.image} alt={p.title} linkText={linkText} />
            )}
          </div>

          {/* TEXT */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>

              <span className="rounded-full border border-border/60 bg-background/30 px-3 py-1 text-[11px] text-muted-foreground">
                {mobile ? "Mobile" : "Web"}
              </span>
            </div>

            {subtitle ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {subtitle}
              </p>
            ) : null}

            <div className="pt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.18em]">View case study</span>
              <span className="opacity-70 group-hover:opacity-100">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- page grid ---------- */

export default function ProjectsGrid({ initialProjects }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  const allTags = useMemo(() => {
    const s = new Set();
    projects.forEach((p) => {
      (p.keywords ?? []).forEach((k) => {
        if (k && typeof k === "string") s.add(k.trim());
      });
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return projects.filter((p) => {
      const title = (p.title ?? "").toLowerCase();
      const description = (p.description ?? "").toLowerCase();
      const keywords = (p.keywords ?? []).map((k) => String(k).toLowerCase());

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

  const pillBase =
    "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] transition";
  const pillOn = "border-border bg-accent/60 text-foreground";
  const pillOff =
    "border-border/60 bg-card/30 text-muted-foreground hover:bg-accent/50 hover:text-foreground";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div
        className="
          space-y-4 rounded-2xl border border-border
          bg-card/60 backdrop-blur p-4 sm:p-5
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)]
        "
      >
        {/* Search */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or tech…"
            className="
              w-full sm:max-w-md
              rounded-xl border border-input
              bg-background/40 px-3 py-2 text-sm text-foreground
              placeholder:text-muted-foreground/70
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Filter by tag
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className={[pillBase, activeTag === "all" ? pillOn : pillOff].join(" ")}
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
                  pillBase,
                  activeTag.toLowerCase() === tag.toLowerCase() ? pillOn : pillOff,
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground pb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
        {projects.length} projects
      </p>

      {/* Brag grid (messy stagger + mixed frames) */}
      <div className="grid gap-7 lg:grid-cols-2 lg:gap-10">
        {filtered.map((p, idx) => (
          <ProjectTile key={p.id} p={p} idx={idx} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 text-sm text-foreground">
          No projects match your search and filters.
          <span className="mt-1 block text-xs text-muted-foreground">
            Try clearing the search or selecting a different tag.
          </span>
        </div>
      )}
    </div>
  );
}