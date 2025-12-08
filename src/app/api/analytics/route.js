import { insertRouteView } from "@/lib/db";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const rawPath = (body.path || "").trim();
  if (!rawPath) {
    return new Response("Missing path", { status: 400 });
  }

  // keep path reasonably short
  const path = rawPath.slice(0, 255);

  try {
    await insertRouteView(path);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Analytics insert failed:", err);
    return new Response("Error logging analytics", { status: 500 });
  }
}
