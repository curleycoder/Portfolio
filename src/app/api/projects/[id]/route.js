import { auth0 } from "@/lib/auth0";
import {
  deleteProject,
  insertAuditLog,
  updateProject,
} from "@/lib/db";

export async function PUT(request, { params }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  const updated = await updateProject(id, {
    title: body.title,
    description: body.description,
    image: body.image,
    link: body.link,
    keywords: body.keywords ?? [],
    images: body.images ?? [],
  });

  if (!updated) {
    return new Response("Not found", { status: 404 });
  }

  await insertAuditLog({
    projectId: id,
    userEmail: user.email,
    action: "update",
    payload: updated,
  });

  return Response.json(updated);
}

// DELETE PROJECT
export async function DELETE(_request, { params }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = params;

  const deleted = await deleteProject(id);
  if (!deleted) {
    return new Response("Not found", { status: 404 });
  }

  await insertAuditLog({
    projectId: id,
    userEmail: user.email,
    action: "delete",
    payload: deleted,
  });

  return new Response(null, { status: 204 });
}
