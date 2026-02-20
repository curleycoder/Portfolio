
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { countBlogPosts, fetchBlogPostsPage } from "@/lib/db";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;

export default async function BlogIndexPage({ searchParams }) {
  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const page = Math.max(
    1,
    Number(searchParams?.page ?? "1") || 1
  );
  const offset = (page - 1) * PAGE_SIZE;

  const [totalCount, posts] = await Promise.all([
    countBlogPosts(),
    fetchBlogPostsPage({ limit: PAGE_SIZE, offset }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
              Blog
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Thoughts, notes & build logs
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Short posts about what I&apos;m building and learning.
            </p>
          </div>

          {isLoggedIn && (
            <Button
              asChild
              className="border border-blue-400/50 bg-blue-500/80 text-xs shadow-lg shadow-blue-900/50 hover:bg-blue-400"
            >
              <Link href="/blog/new">+ New Post</Link>
            </Button>
          )}
        </div>

        {/* List of posts */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-sm text-neutral-400">
              No posts yet. Once you create one, it will show up here.
            </p>
          )}

          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 hover:border-blue-500/60 transition-colors"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-lg font-semibold text-neutral-50">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                {new Date(post.published_at).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm text-neutral-200 line-clamp-3">
                {post.excerpt || post.content.slice(0, 180) + "..."}
              </p>
              <div className="mt-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}`}
                  className="rounded-full border border-neutral-700 px-3 py-1 hover:border-neutral-500"
                >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="rounded-full border border-neutral-700 px-3 py-1 hover:border-neutral-500"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
