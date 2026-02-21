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

function ProjectTile({ p, idx }) {
  const subtitle = safeText(p?.shortDescription || "");
  const cover = safeText(p?.image);     // ✅ cover image
  const logo = safeText(p?.logo);       // ✅ logo image (new field)

  // stagger (keep your vibe)
  const stagger =
    idx % 3 === 0
      ? "lg:-translate-y-6"
      : idx % 3 === 1
      ? "lg:translate-y-12"
      : "lg:translate-y-2";

  return (
    <Link
      href={`/projects/${p.id}`}
      className={[
        "group block no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        stagger,
      ].join(" ")}
      aria-label={`Open ${p.title}`}
    >
      <div
        className={[
          "relative overflow-hidden rounded-[28px]",
          "border border-border/50 bg-card/35 backdrop-blur-xl",
          "shadow-[0_18px_60px_-40px_rgba(0,0,0,0.55)]",
          "transition-transform duration-300 group-hover:scale-[1.01]",
        ].join(" ")}
      >
        {/* COVER */}
        <div className="relative h-[260px] sm:h-[320px] w-full">
          {cover ? (
            <Image
              src={cover}
              alt={`${p.title} cover`}
              fill
              className="object-cover"
              unoptimized={isDataUrl(cover)}
              sizes="(min-width:1024px) 50vw, 100vw"
              priority={idx < 2}
            />
          ) : (
            <div className="h-full w-full bg-background/20" />
          )}

          {/* dark overlay for text legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Header strip (logo + title) */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* LOGO */}
                {logo ? (
  <div
    className="
      h-10 px-3
      inline-flex items-center
      rounded-full
      border border-white/12
      bg-black/35
      backdrop-blur
      shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]
    "
    title={`${p.title} logo`}
  >
    <Image
      src={logo}
      alt={`${p.title} logo`}
      width={84}
      height={28}
      className="h-6 w-auto object-contain"
      unoptimized={isDataUrl(logo)}
      priority={idx < 2}
    />
  </div>
) : null}

                <h3 className="min-w-0 truncate text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {p.title}
                </h3>
              </div>

              {/* optional tag pill - keep if you want */}
              {Array.isArray(p?.keywords) && p.keywords.length ? (
                <span className="shrink-0 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] text-white/80">
                  {isMobileProject(p) ? "Mobile" : "Web"}
                </span>
              ) : null}
            </div>

            {subtitle ? (
              <p className="mt-2 text-sm text-white/75 line-clamp-2 max-w-[60ch]">
                {subtitle}
              </p>
            ) : null}

            <div className="mt-3 inline-flex items-center gap-2 text-xs text-white/70">
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