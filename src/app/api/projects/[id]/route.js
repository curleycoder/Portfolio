import { auth0 } from "@/lib/auth0";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
  insertAuditLog,
} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

/* ---------------- ADMIN CHECK ---------------- */

const adminEmails =
  process.env.ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean) ?? [];

function isAdmin(user) {
  return !!user?.email && adminEmails.includes(user.email.toLowerCase());
}

/* ---------------- HELPERS ---------------- */

function cleanStr(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

function cleanArr(v) {
  if (v === undefined || v === null) return undefined;

  if (typeof v === "string") {
    const s = v.trim();
    return s ? [s] : [];
  }

  if (Array.isArray(v)) {
    return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  }

  return undefined;
}

function isValidUrlOrEmpty(s) {
  if (!s) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    return (await req.json()) ?? {};
  }

  if (
    ct.includes("multipart/form-data") ||
    ct.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await req.formData();
    const obj = Object.fromEntries(formData.entries());
    obj.keywords = formData.getAll("keywords");
    obj.images = formData.getAll("images");
    return obj;
  }

  try {
    return (await req.json()) ?? {};
  } catch {
    return {};
  }
}

/* ============================= */
/* ========== GET ============== */
/* ============================= */

export async function GET(req, { params }) {
  noStore();

  try {
    const id = params?.id;

    if (!id) {
      return Response.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const project = await fetchProjectById(id);

    if (!project) {
      return Response.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { ok: true, project },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/projects/[id] error:", err);
    return Response.json(
      {
        ok: false,
        error: "Internal server error",
        detail: err?.message,
      },
      { status: 500 }
    );
  }
}

/* ============================= */
/* ========== PATCH ============ */
/* ============================= */

export async function PATCH(req, { params }) {
  noStore();

  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const id = params?.id;
    if (!id) {
      return Response.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const existing = await fetchProjectById(id);
    if (!existing) {
      return Response.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    const data = await readBody(req);

    const title = cleanStr(data.title);
    const shortDescription = cleanStr(data.shortDescription);
    const description = cleanStr(data.description);
    const image = cleanStr(data.image);
    const link = cleanStr(data.link);
    const githubLink = cleanStr(data.githubLink);
    const demoLink = cleanStr(data.demoLink);
    const figmaLink = cleanStr(data.figmaLink);
    const keywords = cleanArr(data.keywords);
    const images = cleanArr(data.images);
    const media =
  data.media === undefined
    ? undefined
    : Array.isArray(data.media)
      ? data.media
      : JSON.parse(String(data.media || "[]"));

const highlights =
  data.highlights === undefined
    ? undefined
    : Array.isArray(data.highlights)
      ? data.highlights
      : JSON.parse(String(data.highlights || "[]"));


    if (title !== undefined && title.length < 2) {
      return Response.json(
        { ok: false, error: "Title too short" },
        { status: 400 }
      );
    }

    if (shortDescription !== undefined && shortDescription.length > 160) {
      return Response.json(
        { ok: false, error: "shortDescription max 160 chars" },
        { status: 400 }
      );
    }

    if (link !== undefined && !isValidUrlOrEmpty(link)) {
      return Response.json(
        { ok: false, error: "Invalid live link URL" },
        { status: 400 }
      );
    }

    const updated = await updateProject(id, {
      title,
      shortDescription,
      description,
      image,
      link,
      githubLink,
      demoLink,
      figmaLink,
      keywords,
      images,
      media,
      highlights,
    });

    await insertAuditLog({
      projectId: id,
      userEmail: user.email ?? "unknown",
      action: "update",
      payload: updated,
    });

    try {
      revalidatePath("/projects");
      revalidatePath(`/projects/${id}`);
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath skipped:", e?.message);
    }

    return Response.json(
      { ok: true, project: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return Response.json(
      {
        ok: false,
        error: "Internal server error",
        detail: err?.message,
      },
      { status: 500 }
    );
  }
}

/* ============================= */
/* ========== DELETE =========== */
/* ============================= */

export async function DELETE(req, { params }) {
  noStore();

  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const id = params?.id;
    if (!id) {
      return Response.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    await deleteProject(id);

    await insertAuditLog({
      projectId: id,
      userEmail: user.email ?? "unknown",
      action: "delete",
      payload: { id },
    });

    try {
      revalidatePath("/projects");
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath skipped:", e?.message);
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return Response.json(
      {
        ok: false,
        error: "Internal server error",
        detail: err?.message,
      },
      { status: 500 }
    );
  }
}
