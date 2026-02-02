import { auth0 } from "@/lib/auth0";
import { fetchProjectById, insertAuditLog } from "@/lib/db";
// ⛔️ IMPORTANT: change these 2 names to match your db file exports:
import { updateProject, deleteProject } from "@/lib/db";

const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

function isAdmin(user) {
  if (!user?.email) return false;
  return adminEmails.includes(user.email.toLowerCase());
}

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    const existing = await fetchProjectById(id);
    if (!existing) {
      return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const image = formData.get("image")?.toString().trim();
    const link = formData.get("link")?.toString().trim();

    // ✅ NEW: rationale + highlights (assignment fields)
    const rationale = formData.get("rationale")?.toString().trim() ?? "";
    const highlightsRaw = formData.get("highlights")?.toString() ?? "[]";
    const highlights = safeJsonParse(highlightsRaw, []);

    const keywords = formData
      .getAll("keywords")
      .map((k) => k.toString().trim())
      .filter(Boolean);

    const images = formData
      .getAll("images")
      .map((v) => v.toString().trim())
      .filter(Boolean);

    // Required fields for your app
    if (!title || !description || !image || !link) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Optional stricter validation for assignment:
    // - You can leave this OUT if you don’t want server-side enforcement.
    // if (!rationale) {
    //   return Response.json(
    //     { ok: false, error: "Rationale is required" },
    //     { status: 400 }
    //   );
    // }
    // if (!Array.isArray(highlights)) {
    //   return Response.json(
    //     { ok: false, error: "Highlights must be an array" },
    //     { status: 400 }
    //   );
    // }

    const updated = await updateProject(id, {
      title,
      description,
      image,
      link,
      keywords,
      images,

      // ✅ Save assignment fields
      rationale,
      highlights,
    });

    await insertAuditLog({
      projectId: id,
      userEmail: user.email ?? "unknown",
      action: "update",
      payload: updated,
    });

    return Response.json({ ok: true, project: updated }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    await deleteProject(id);

    await insertAuditLog({
      projectId: id,
      userEmail: user.email ?? "unknown",
      action: "delete",
      payload: { id },
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
