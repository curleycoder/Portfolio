export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPostBySlug } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function BlogPostPage({ params }) {
  const { slug } = params;

  const post = await fetchBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
        <div>
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-100"
          >
            ← Back to Blog
          </Link>
        </div>

        <Card className="border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <header className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              {new Date(post.published_at).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-sm text-neutral-900">{post.excerpt}</p>
            )}
          </header>

          <div className="prose prose-invert max-w-none prose-p:mb-3 text-white prose-p:text-sm">
            {/* plain text / markdown – you can swap to react-markdown later */}
            {post.content.split("\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
