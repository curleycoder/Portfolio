import { NextResponse } from "next/server";
import {
  ensureProjectsTable,
  seedProjectsTable,
  fetchProjects,
} from "@/lib/db";
import { PROJECT_SEED } from "@/lib/project-seed";

export async function GET(req) {
  try {
    await ensureProjectsTable();
    await seedProjectsTable(PROJECT_SEED);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = 6;
    const offset = (page - 1) * limit;

    const projects = await fetchProjects({ limit, offset });

    return NextResponse.json({ projects, page });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function insertAuditLog({ projectId, userEmail, action, payload }) {
  await sql`
    INSERT INTO project_audit_logs (project_id, user_email, action, payload)
    VALUES (
      ${projectId},
      ${userEmail},
      ${action},
      ${JSON.stringify(payload)}
    );
  `;
}
