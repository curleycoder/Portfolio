import { NextResponse } from "next/server";
import { deleteProject, fetchProjectById, updateProject } from "@/lib/db";
import { z } from "zod";

export async function DELETE(_req, { params }) {
  try {
    const id = params?.id;
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Optional: GET single project (handy)
export async function GET(_req, { params }) {
  const project = await fetchProjectById(params?.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, project });
}

// Optional: PATCH update
const patchSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(5).optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  media: z.array(z.string()).optional(),
  whyTitle: z.string().optional(),
  why: z.string().optional(),
  rationaleProblem: z.string().optional(),
  rationaleChallenge: z.string().optional(),
  rationaleSolution: z.string().optional(),
  rationale: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  githubLink: z.string().optional(),
  demoLink: z.string().optional(),
  figmaLink: z.string().optional(),
});

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

    const updated = await updateProject(params?.id, parsed.data);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true, project: updated });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}