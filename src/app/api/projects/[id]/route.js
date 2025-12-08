import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import {
  getProjectById,
  updateProject,
  deleteProject,
  // insertAuditLog, // 🔴 disabled – table doesn't exist
} from "@/lib/db";

const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(5).max(500).optional(),
  image: z
    .string()
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      {
        message:
          "Must be a full URL (https://...) or a /public path like `/forge.png`",
      }
    )
    .optional(),
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

// GET /api/projects/:id -> one project (public)
export async function GET(_req, { params }) {
  const project = await getProjectById(params.id);

  if (!project) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

// PUT /api/projects/:id -> update (logged-in only)
export async function PUT(req, { params }) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = projectUpdateSchema.parse(json);

    const updated = await updateProject(params.id, body);

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project updated",
      project: updated,
    });
  } catch (err) {
    console.error("PUT /api/projects/[id] error:", err);

    if (err.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid payload", issues: err.errors },
        { status: 400 }
      );
    }

    if (err.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id -> delete (logged-in only)
export async function DELETE(_req, { params }) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deleted = await deleteProject(params.id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // 🔇 audit logging disabled
    // await insertAuditLog({
    //   projectId: deleted.id,
    //   userEmail: user.email ?? "unknown",
    //   action: "delete",
    //   payload: deleted,
    // });

    return NextResponse.json({
      message: "Project deleted",
      project: deleted,
    });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);

    if (err.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
