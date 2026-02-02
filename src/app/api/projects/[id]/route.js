import { NextResponse } from "next/server";
import { requireAdminOr401 } from "@/lib/admin";
import { updateProjectById, deleteProjectById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const admin = await requireAdminOr401();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  const updated = await updateProjectById(id, body);
  return NextResponse.json({ project: updated });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdminOr401();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  await deleteProjectById(id);
  return NextResponse.json({ ok: true });
}
