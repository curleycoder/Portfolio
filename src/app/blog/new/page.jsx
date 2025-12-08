import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import NewPostForm from "./newBlogForm";

export default async function NewBlogPostPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-100"
          >
            ← Back to Blog
          </Link>
          <Card className="border border-neutral-800 bg-neutral-900/70 p-6 text-sm text-neutral-200">
            You must be logged in to create a blog post.
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-100"
        >
          ← Back to Blog
        </Link>

        <Card className="border border-neutral-800 bg-neutral-900/70 p-6 space-y-4">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-50">
            New Blog Post
          </h1>
          <p className="text-xs text-neutral-400">
            Share an update, a build log, or something you&apos;ve learned.
          </p>

          <NewPostForm />
        </Card>
      </div>
    </main>
  );
}
