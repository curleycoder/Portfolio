import { NextResponse } from "next/server";
import { requireAdminOr401 } from "@/lib/admin";
import { createProject } from "@/lib/db"; // you implement
import { ensureProjectsTable } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const admin = await requireAdminOr401();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureProjectsTable();

  const body = await req.json();

  // Minimal validation (tighten as needed)
  if (!body?.title || !body?.description) {
    return NextResponse.json(
      { error: "Missing required fields: title, description" },
      { status: 400 }
    );
  }

  const created = await createProject(body);
  return NextResponse.json({ project: created }, { status: 201 });
}
