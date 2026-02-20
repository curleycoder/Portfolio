import { insertRouteView } from "@/lib/db";

export async function POST(req) {
  // ✅ Dev: don't write analytics (prevents spam + saves quota)
  if (process.env.NODE_ENV !== "production") {
    return new Response(null, { status: 204 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 204 }); // don't break UX
  }

  const rawPath = (body?.path || "").trim();
  if (!rawPath) {
    return new Response(null, { status: 204 });
  }

  const path = rawPath.slice(0, 255);

  try {
    await insertRouteView(path);
    return new Response(null, { status: 204 });
  } catch (err) {
    // ✅ Quota / DB down: swallow. Analytics should never take down the app.
    const msg = String(err?.message || "");
    if (msg.includes("402") || msg.toLowerCase().includes("quota")) {
      return new Response(null, { status: 204 });
    }

    console.error("Analytics insert failed:", err);
    return new Response(null, { status: 204 });
  }
}
