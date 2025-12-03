import { NextResponse } from "next/server";
import {
  ensureProjectsTable,
  seedProjectsTable,
  fetchProjects,
} from "@/lib/db";
import { PROJECT_SEED } from "@/lib/project-seed";

// 🔥 Make route dynamic so Next never tries to statically optimize it
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Ensure tables + seed
    await ensureProjectsTable();
    await seedProjectsTable(PROJECT_SEED);

    // ✅ Use nextUrl instead of new URL(req.url)
    const searchParams = req.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) || 1 : 1;

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
