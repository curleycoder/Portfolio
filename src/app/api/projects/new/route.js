import { NextResponse } from "next/server";
import { insertProject } from "@/lib/db";
import { z } from "zod";

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

const newProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(700),
  image: imageSchema,
  link: z.string().url(),

  // match your db fields
  shortDescription: z.string().optional(),
  keywords: z.array(z.string().min(1)).max(20).optional().default([]),
  images: z.array(imageSchema).optional().default([]),

  // optional extended fields supported by db
  media: z.array(imageSchema).optional().default([]),
  whyTitle: z.string().optional(),
  why: z.string().optional(),
  rationaleProblem: z.string().optional(),
  rationaleChallenge: z.string().optional(),
  rationaleSolution: z.string().optional(),
  rationale: z.string().optional(),
  highlights: z.array(z.string().min(1)).optional().default([]),

  githubLink: z.string().optional(),
  demoLink: z.string().optional(),
  figmaLink: z.string().optional(),
});

export async function POST(req) {
  try {
    const body = await req.json();

    // accept the simple form payload you currently submit
    const parsed = newProjectSchema.safeParse({
      ...body,
      shortDescription: body.shortDescription ?? body.description, // fallback
    });

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