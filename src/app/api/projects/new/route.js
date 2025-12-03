import { insertProject, insertAuditLog } from "@/lib/db";
import { auth0 } from "@/lib/auth0";

// ✅ Admin helper IN THIS FILE (no extra import)
const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

function isAdmin(user) {
  if (!user?.email) return false;
  return adminEmails.includes(user.email.toLowerCase());
}

export async function POST(req) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    // 🔒 only admins can create
    if (!user || !isAdmin(user)) {
      return Response.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const img = formData.get("img")?.toString().trim();
    const link = formData.get("link")?.toString().trim();
    const keywords = formData
      .getAll("keywords")
      .map((k) => k.toString().trim())
      .filter(Boolean);

    if (!title || !description || !img || !link) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // DB insert
    const project = await insertProject({
      title,
      description,
      image: img, // map img -> image
      link,
      keywords,
    });

    // audit log
    await insertAuditLog({
      projectId: project.id,
      userEmail: user.email ?? "unknown",
      action: "create",
      payload: project,
    });

    return Response.json({ ok: true, project }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects/new error:", err);
    if (err.message === "Unauthorized") {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return Response.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
