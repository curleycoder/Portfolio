import Link from "next/link";
import Image from "next/image";
import { fetchProjects } from "@/lib/db";

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
function firstNonEmpty(arr) {
  for (const x of arr || []) {
    const v = String(x || "").trim();
    if (v) return v;
  }
  return "";
}

function getPreviewMedia(p) {
  // 1) gallery images first
  const img = firstNonEmpty(p?.images);
  if (img) return { type: "image", src: img };

  // 2) fallback: first flow media (image or video)
  const media = Array.isArray(p?.media) ? p.media : [];
  for (const m of media) {
    const src = String(m?.src || "").trim();
    if (!src) continue;
    const type = m?.type === "video" ? "video" : "image";
    return { type, src };
  }

  // 3) last resort: logo (so card is never blank)
  const logo = safeText(p?.image);
  if (logo) return { type: "image", src: logo };

  return { type: "image", src: "" };
}
// function LogoBadge({ src, alt }) {
//   const safe = safeText(src);
//   if (!safe) return null;

//   return (
//     <div className="absolute left-4 top-4 z-10 rounded-2xl backdrop-blur px-3 py-2">
//       <div className="relative h-9 w-28 sm:h-10 sm:w-32">
//         <Image
//           src={safe}
//           alt={alt || "logo"}
//           fill
//           className="object-contain"
//           unoptimized={isDataUrl(safe)}
//           sizes="128px"
//         />
//       </div>
//     </div>
//   );
// }
/* ---------- frames ---------- */

function PhoneFrame({ src, alt, type = "image" }) {
  const safe = safeText(src);

  return (
    <div className="relative mx-auto w-[210px] max-w-full">
      <div className="relative overflow-hidden rounded-[28px] bg-background/20 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />

        <div className="relative aspect-[9/19] w-full bg-black/15">
          {safe ? (
            type === "video" ? (
              <video
                className="h-full w-full object-cover"
                src={safe}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={safe}
                alt={alt}
                fill
                className="object-cover"
                unoptimized={isDataUrl(safe)}
                sizes="210px"
              />
            )
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

function BrowserFrame({ src, alt, linkText, type = "image" }) {
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
          type === "video" ? (
            <video
              className="h-full w-full object-contain"
              src={safe}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={safe}
              alt={alt}
              fill
              className="object-contain"
              unoptimized={isDataUrl(safe)}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          )
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
function getYear(p) {
  // Prefer explicit year if you add it later
  const y = p?.year ?? p?.createdYear;
  if (typeof y === "number" && y > 1900) return String(y);
  if (typeof y === "string" && /^\d{4}$/.test(y.trim())) return y.trim();

  // Fall back to created timestamps if present
  const d =
    p?.createdAt || p?.created_at || p?.created || p?.date || p?.updatedAt || p?.updated_at;

  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return String(dt.getFullYear());
}

function LogoInline({ src, alt }) {
  const safe = safeText(src);
  if (!safe) return null;

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
      <Image
        src={safe}
        alt={alt || "logo"}
        fill
        className="object-contain p-1"
        unoptimized={isDataUrl(safe)}
        sizes="36px"
      />
    </div>
  );
}

/* ---------- tile ---------- */

function WorkTile({ p, idx }) {
  const mobile = isMobileProject(p);

  // ✅ only show if shortDescription exists
  const subtitle = safeText(p?.shortDescription);

  // ✅ logo is cover image (your rule)
  const logoSrc = safeText(p?.image);

  // ✅ frame shows gallery/flow media (your rule)
  const preview = getPreviewMedia(p);

  const linkText = stripProtocol(p?.link);
  const year = getYear(p);

  // messy stagger (hen-ry-ish)
  const stagger =
    idx % 3 === 0
      ? "lg:-translate-y-6"
      : idx % 3 === 1
      ? "lg:translate-y-12"
      : "lg:translate-y-2";

  const frameMin =
    mobile ? "min-h-[420px] sm:min-h-[480px]" : "min-h-[260px] sm:min-h-[320px]";

  return (
    <Link
      href={`/projects/${p.id}`}
      className={[
        "group block no-underline",
        "focus-visible:ring-offset-background",
        stagger,
      ].join(" ")}
      aria-label={`Open ${p.title}`}
    >
      <div
        className={[
          "relative h-full overflow-hidden rounded-[28px]",
          "border border-border/50 bg-card/35 backdrop-blur-xl",
          
          "flex flex-col", // ✅ lets us pin year at bottom
        ].join(" ")}
      >
        {/* glow blobs */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative p-5 sm:p-7 flex flex-col gap-4 flex-1">
          {/* ✅ HEADER (logo next to title) */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <LogoInline src={logoSrc} alt={`${p.title} logo`} />

                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground truncate">
                    {p.title}
                  </h3>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-border/60 bg-background/30 px-3 py-1 text-[11px] text-muted-foreground">
                {mobile ? "Mobile" : "Web"}
              </span>
            </div>

            {subtitle ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* ✅ FRAME (cover media) */}
          <div className={["p-2 overflow-hidden", frameMin].join(" ")}>
            {mobile ? (
              <PhoneFrame src={preview.src} type={preview.type} alt={p.title} />
            ) : (
              <BrowserFrame
                src={preview.src}
                type={preview.type}
                alt={p.title}
                linkText={linkText}
              />
            )}
          </div>

          {/* ✅ CTA */}
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase tracking-[0.18em]">View Project</span>
            <span className="opacity-70 group-hover:opacity-100">→</span>
          </div>

          {/* ✅ YEAR pinned to bottom */}
          {year ? (
            <div className="mt-auto pt-2 text-[11px] font-mono text-muted-foreground/80">
              {year}
            </div>
          ) : (
            <div className="mt-auto" />
          )}
        </div>
        {p.repoYear ? (
  <div className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
    {p.repoYear}
  </div>
) : null}
      </div>
    </Link>
  );
}

/* ---------- homepage section ---------- */

export default async function ProjectPreviewCard({ count = 2 }) {
  const projects = await fetchProjects({ limit: count, offset: 0 });
  if (!projects || projects.length === 0) return null;

  const items = projects.slice(0, count);

  return (
    <section className="space-y-8 pb-9">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Work
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Selected Projects
          </h2>
        </div>

        <Link
          href="/projects"
          className="
            inline-flex items-center rounded-xl px-3 py-2 text-xs
            text-muted-foreground transition
           
            hover:bg-accent/60 hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
          "
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-7 lg:grid-cols-2 lg:gap-10">
        {items.map((p, idx) => (
          <WorkTile key={p.id} p={p} idx={idx} />
        ))}
      </div>
    </section>
  );
}