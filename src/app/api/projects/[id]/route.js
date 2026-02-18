import { auth0 } from "@/lib/auth0";
import { fetchProjectById, updateProject, deleteProject, insertAuditLog } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

function isAdmin(user) {
  return !!user?.email && adminEmails.includes(user.email.toLowerCase());
}

function cleanStr(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}


function cleanArr(v) {
  if (v === undefined || v === null) return undefined;

  // If a single string is sent, treat it as a single-item array
  if (typeof v === "string") {
    const s = v.trim();
    return s ? [s] : [];
  }

  // If already an array, clean it
  if (Array.isArray(v)) {
    return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  }

  // Anything else: don't override existing values
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

function safeJsonParse(value, fallback) {
  try {
    if (value == null) return fallback;
    if (typeof value === "object") return value;
    const s = String(value).trim();
    if (!s) return fallback;
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function validateHighlight(h) {
  if (!h || typeof h !== "object") return false;
  const title = String(h.title ?? "").trim();
  const caption = String(h.caption ?? "").trim();
  const image = String(h.image ?? "").trim();

  if (!title && !caption && !image) return false;
  if (!image) return false; // only require image if highlight exists
  return true;
}

function buildRationale({ problem, challenge, solution }) {
  const blocks = [];
  if (problem) blocks.push(`Problem:\n${problem}`);
  if (challenge) blocks.push(`Challenge:\n${challenge}`);
  if (solution) blocks.push(`Solution:\n${solution}`);
  return blocks.join("\n\n").trim();
}

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    const data = await req.json();
    return data ?? {};
  }

  if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
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

export async function PATCH(req, { params }) {
  noStore(); // helps dev + avoids some cache weirdness

  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const id = params?.id;
    if (!id) return Response.json({ ok: false, error: "Missing id" }, { status: 400 });

    const existing = await fetchProjectById(id);
    if (!existing) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

    const data = await readBody(req);

    // only set keys that are present in request
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

    const whyTitle = cleanStr(data.whyTitle);
    const why = cleanStr(data.why);

    const rationaleProblem = cleanStr(data.rationaleProblem);
    const rationaleChallenge = cleanStr(data.rationaleChallenge);
    const rationaleSolution = cleanStr(data.rationaleSolution);

    const rationale =
      rationaleProblem !== undefined || rationaleChallenge !== undefined || rationaleSolution !== undefined
        ? buildRationale({
            problem: rationaleProblem ?? existing.rationaleProblem,
            challenge: rationaleChallenge ?? existing.rationaleChallenge,
            solution: rationaleSolution ?? existing.rationaleSolution,
          })
        : undefined;

    const highlightsRaw =
      data.highlights === undefined
        ? undefined
        : Array.isArray(data.highlights)
          ? data.highlights
          : safeJsonParse(data.highlights, []);

    const cleanedHighlights =
      highlightsRaw === undefined
        ? undefined
        : (Array.isArray(highlightsRaw) ? highlightsRaw : [])
            .filter(validateHighlight)
            .map((h) => ({
              title: String(h.title ?? "").trim(),
              caption: String(h.caption ?? "").trim(),
              image: String(h.image ?? "").trim(),
            }));

    // Validation: only validate what is being changed
    if (title !== undefined && title.length < 2) {
      return Response.json({ ok: false, error: "Title too short" }, { status: 400 });
    }
    if (shortDescription !== undefined && shortDescription.length > 160) {
      return Response.json({ ok: false, error: "shortDescription must be <= 160 chars" }, { status: 400 });
    }
    if (link !== undefined && !isValidUrlOrEmpty(link)) {
      return Response.json({ ok: false, error: "Invalid live link URL" }, { status: 400 });
    }
    if (githubLink !== undefined && !isValidUrlOrEmpty(githubLink)) {
      return Response.json({ ok: false, error: "Invalid githubLink URL" }, { status: 400 });
    }
    if (demoLink !== undefined && !isValidUrlOrEmpty(demoLink)) {
      return Response.json({ ok: false, error: "Invalid demoLink URL" }, { status: 400 });
    }
    if (figmaLink !== undefined && !isValidUrlOrEmpty(figmaLink)) {
      return Response.json({ ok: false, error: "Invalid figmaLink URL" }, { status: 400 });
    }
    if (image !== undefined && !image) {
      return Response.json({ ok: false, error: "Image cannot be empty" }, { status: 400 });
    }
    if (description !== undefined && !description) {
      return Response.json({ ok: false, error: "Description cannot be empty" }, { status: 400 });
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
      whyTitle,
      why,
      rationaleProblem,
      rationaleChallenge,
      rationaleSolution,
      rationale,
      highlights: cleanedHighlights,
    });

    await insertAuditLog({
      projectId: id,
      userEmail: user.email ?? "unknown",
      action: "update",
      payload: updated,
    });

    // Revalidate AFTER db update. Keep minimal.
    try {
      revalidatePath("/projects");
      revalidatePath(`/projects/${id}`);
      revalidatePath("/");
    } catch (e) {
      // In dev you can hit "static generation store missing" sometimes; ignore.
      console.warn("revalidatePath skipped:", e?.message);
    }

    return Response.json({ ok: true, project: updated }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return Response.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  noStore();

  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !isAdmin(user)) {
      return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const id = params?.id;
    if (!id) return Response.json({ ok: false, error: "Missing id" }, { status: 400 });

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
    return Response.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
