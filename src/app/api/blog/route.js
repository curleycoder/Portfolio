import { auth0 } from "@/lib/auth0";
import { insertBlogPost } from "@/lib/db";

export async function POST(req) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const title = (body.title || "").trim();
  const excerpt = (body.excerpt || "").trim();
  const content = (body.content || "").trim();

  if (!title || !content) {
    return new Response("Title and content are required", { status: 400 });
  }

  try {
    const post = await insertBlogPost({
      title,
      excerpt,
      content,
      authorEmail: user.email,
    });

    return new Response(JSON.stringify({ slug: post.slug }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating blog post:", err);
    return new Response("Failed to create post", { status: 500 });
  }
}
