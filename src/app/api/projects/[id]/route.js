import { NextResponse } from "next/server";
import { deleteProject, fetchProjectById, updateProject } from "@/lib/db";
import { z } from "zod";

/** ===== helpers ===== */
const MAX_GALLERY = 10;

function trimOrUndef(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function uniqKeepOrder(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr || []) {
    const v = String(x ?? "").trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * "Upload only" enforcement.
 * Update these to match whatever your /api/upload returns.
 *
 * Examples:
 * - if you store in /uploads/... then allow "/uploads/"
 * - if you use S3/R2 with a fixed CDN, allow that base URL
 */
const ALLOWED_MEDIA_PREFIXES = [
  "/uploads/", // common local pattern
  // "https://YOUR_CDN_DOMAIN/",
];

function isAllowedMediaUrl(url) {
  const u = String(url || "").trim();
  if (!u) return false;
  return ALLOWED_MEDIA_PREFIXES.some((p) => u.startsWith(p));
}

/** ===== route handlers ===== */
export async function DELETE(_req, { params }) {
  try {
    const id = params?.id;
    const deleted = await deleteProject(id);

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, deleted }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(_req, { params }) {
  const project = await fetchProjectById(params?.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, project });
}

/** ===== schemas ===== */
const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]).optional(),
  src: z.string(),
  caption: z.string().optional(),
});

const highlightSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  image: z.string(),
});

const patchSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  shortDescription: z.string().optional(),

  // keep as text (bullets one-per-line)
  description: z.string().optional(),
logo: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),

  keywords: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),

  media: z.array(mediaItemSchema).optional(),
  highlights: z.array(highlightSchema).optional(),

  whyTitle: z.string().optional(),
  why: z.string().optional(),
  repoYear: z.number().int().min(1970).max(2100).optional(),

  rationaleProblem: z.string().optional(),
  rationaleChallenge: z.string().optional(),
  rationaleSolution: z.string().optional(),
  rationale: z.string().optional(),

  githubLink: z.string().optional(),
  demoLink: z.string().optional(),
  figmaLink: z.string().optional(),

  // (later) betterThan / competitors / etc: add here when you add DB cols
});

/** ===== PATCH ===== */
export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // -------- sanitize / enforce rules --------
    const data = parsed.data;

    const cleaned = {
      // strings (trim + drop empty)
      title: trimOrUndef(data.title),
      shortDescription: trimOrUndef(data.shortDescription),
      description: trimOrUndef(data.description),

      image: trimOrUndef(data.image),
      link: trimOrUndef(data.link),
      githubLink: trimOrUndef(data.githubLink),
      demoLink: trimOrUndef(data.demoLink),
      figmaLink: trimOrUndef(data.figmaLink),

      whyTitle: trimOrUndef(data.whyTitle),
      why: trimOrUndef(data.why),

      rationaleProblem: trimOrUndef(data.rationaleProblem),
      rationaleChallenge: trimOrUndef(data.rationaleChallenge),
      rationaleSolution: trimOrUndef(data.rationaleSolution),
      rationale: trimOrUndef(data.rationale),

      // arrays
      keywords: data.keywords ? uniqKeepOrder(data.keywords) : undefined,

      // ✅ enforce max 10 gallery, dedupe, remove empties, "upload-only" filter (optional)
      images: data.images
        ? uniqKeepOrder(data.images)
            .slice(0, MAX_GALLERY)
            // comment this line out if you want to allow remote urls for gallery
            .filter(isAllowedMediaUrl)
        : undefined,

      // ✅ cover image (logo) "upload-only" (optional)
      image: data.image ? (isAllowedMediaUrl(data.image) ? trimOrUndef(data.image) : undefined) : cleaned?.image,

      // ✅ media steps: normalize type, require src, "upload-only" filter (optional)
      media: Array.isArray(data.media)
        ? data.media
            .map((m) => {
              const src = trimOrUndef(m?.src);
              if (!src) return null;

              const type =
                m?.type === "video" || (m?.type !== "image" && src.match(/\.(mp4|webm|mov)(\?|$)/i))
                  ? "video"
                  : "image";

              // upload-only gate (optional)
              if (!isAllowedMediaUrl(src)) return null;

              return {
                type,
                src,
                caption: trimOrUndef(m?.caption) ?? "",
              };
            })
            .filter(Boolean)
        : undefined,

      // ✅ highlights: require image, "upload-only" filter (optional)
      highlights: Array.isArray(data.highlights)
        ? data.highlights
            .map((h) => {
              const image = trimOrUndef(h?.image);
              if (!image) return null;

              if (!isAllowedMediaUrl(image)) return null;

              return {
                title: trimOrUndef(h?.title) ?? "",
                caption: trimOrUndef(h?.caption) ?? "",
                image,
              };
            })
            .filter(Boolean)
        : undefined,
    };

    // Important: remove keys that are still undefined
    const finalUpdates = Object.fromEntries(
      Object.entries(cleaned).filter(([, v]) => v !== undefined)
    );

    const updated = await updateProject(params?.id, finalUpdates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true, project: updated });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}