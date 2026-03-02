import { NextResponse } from "next/server";
import { insertProject } from "@/lib/db";
import { z } from "zod";

const safeString = z.any().optional().transform((v) => String(v ?? "").trim());

const imageSchema = z
  .string()
  .min(1)
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image"),
    { message: "Must be a URL (https://...) or /path or data:image..." }
  );

// allow empty OR valid URL
const urlOrEmpty = z
  .string()
  .optional()
  .transform((v) => String(v ?? "").trim())
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), {
    message: "Must be empty or a valid URL (https://...)",
  });

const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  src: safeString,
  caption: safeString,
});

const highlightSchema = z.object({
  title: safeString,
  caption: safeString,
  image: safeString,
});

const newProjectSchema = z.object({
  title: z.string().min(2).max(200),

  // match edit form fields
  shortDescription: safeString,
  description: safeString, // bullets text (one per line) OR short paragraph
  betterThan: safeString,

  logo: safeString,
  repoYear: z
    .preprocess((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }, z.number().int().min(2000).max(2100).optional()),

  image: imageSchema,

  link: urlOrEmpty,
  githubLink: urlOrEmpty,
  demoLink: urlOrEmpty,
  figmaLink: urlOrEmpty,

  keywords: z.array(safeString).default([]),
  images: z.array(imageSchema).default([]),

  whyTitle: safeString,
  why: safeString,
  rationaleProblem: safeString,
  rationaleChallenge: safeString,
  rationaleSolution: safeString,
  rationale: safeString,

  // correct shapes
  media: z.array(mediaItemSchema).default([]),
  highlights: z.array(highlightSchema).default([]),
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Back-compat with your current "simple" New form:
    // - If shortDescription not provided, use description as fallback
    // - If betterThan not provided, default to empty
    const normalized = {
      ...body,
      shortDescription:
        body.shortDescription ?? body.short_description ?? body.description ?? "",
      betterThan: body.betterThan ?? body.better_than ?? "",
      logo: body.logo ?? "",
      repoYear: body.repoYear ?? body.repo_year ?? undefined,

      // Accept the old (wrong) "media: [url]" shape if it exists
      media: Array.isArray(body.media) && body.media.length && typeof body.media[0] === "string"
        ? body.media.map((src) => ({ type: "image", src, caption: "" }))
        : body.media,

      // Accept the old (wrong) "highlights: [url]" shape if it exists
      highlights:
        Array.isArray(body.highlights) && body.highlights.length && typeof body.highlights[0] === "string"
          ? body.highlights.map((image) => ({ title: "", caption: "", image }))
          : body.highlights,
    };

    const parsed = newProjectSchema.safeParse(normalized);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const project = await insertProject(parsed.data);
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects/new error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}