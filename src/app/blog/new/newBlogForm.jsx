"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewPostForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString().trim() || "";
    const excerpt = formData.get("excerpt")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim() || "";

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, content }),
    });

    if (!res.ok) {
      const text = await res.text();
      setError(text || "Failed to create post.");
      return;
    }

    const data = await res.json();

    startTransition(() => {
      router.push(`/blog/${data.slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Title
        </label>
        <input
          name="title"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
          placeholder="My experience building the Forge app"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Excerpt (optional)
        </label>
        <textarea
          name="excerpt"
          rows={2}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
          placeholder="A short summary that will show on the blog list."
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Content
        </label>
        <textarea
          name="content"
          rows={10}
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
          placeholder="Write your post here..."
        />
        <p className="mt-1 text-[11px] text-white-500">
          You can write plain text or markdown-style content.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="text-xs border border-blue-500/80 bg-blue-500/80 hover:bg-blue-400"
        >
          {isPending ? "Saving..." : "Publish post"}
        </Button>
      </div>
    </form>
  );
}
