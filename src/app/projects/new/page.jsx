"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const imageSchema = z
  .string()
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/"),
    {
      message:
        "Must be a full URL (https://...) or a /public path like `/forge.png`",
    }
  );

const newProjectSchema = z.object({
  title: z.string().min(2, { message: "Your title is too short" }).max(200),
  description: z.string().min(5).max(500),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string().min(1)).max(10).optional().default([]),
});

export default function NewProjectPage() {
  const [draftKeyword, setDraftKeyword] = useState("");

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "Write your project title here...",
      description: "Write your project description here...",
      image: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
  });

  function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("link", values.link);
    (values.keywords || []).forEach((k) => formData.append("keywords", k));

    fetch("/api/projects/new", {
      method: "POST",
      body: formData,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed");
        const data = await r.json();
        alert("Created (check server logs).");
        console.log("Server response:", data);
      })
      .catch((e) => {
        alert("Submit failed");
        console.error(e);
      });
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Add a new project
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            This will show up in your home page preview and projects list.
          </p>
        </div>

        {/* form card */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-xl shadow-blue-500/20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 text-sm"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-neutral-700 bg-neutral-950 text-sm text-neutral-50"
                        placeholder="A title of your project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      This is the title shown on the cards.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-neutral-700 bg-neutral-950 text-sm text-neutral-50"
                        placeholder="A brief description of your project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Shown under the title and on the details page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-neutral-700 bg-neutral-950 text-sm text-neutral-50"
                        placeholder="https://your-image-link.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Screenshot or hero image for the project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">
                      Project link
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-neutral-700 bg-neutral-950 text-sm text-neutral-50"
                        placeholder="https://your-project-link.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Deployed site, GitHub repo, or demo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => {
                  const current = field.value ?? [];

                  const handleAdd = () => {
                    const v = draftKeyword.trim();
                    if (!v || current.includes(v)) return;
                    field.onChange([...current, v]);
                    setDraftKeyword("");
                  };

                  const handleRemove = (k) => {
                    field.onChange(current.filter((x) => x !== k));
                  };

                  const handleKeyDown = (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAdd();
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-xs text-neutral-300">
                        Keywords
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            value={draftKeyword}
                            onChange={(e) => setDraftKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a keyword and press Enter"
                            className="border-neutral-700 bg-neutral-950 text-sm text-neutral-50"
                          />
                          <Button
                            type="button"
                            onClick={handleAdd}
                            className="text-xs border border-blue-500/80"
                          >
                            Add
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-[11px] text-neutral-500">
                        Tag your project for filtering later (e.g. Next.js,
                        React Native, API).
                      </FormDescription>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {current.map((k) => (
                          <Badge
                            key={k}
                            variant="outline"
                            className="flex items-center gap-1 border-neutral-600 text-[11px] text-neutral-200"
                          >
                            {k}
                            <button
                              type="button"
                              className="ml-1 text-xs"
                              onClick={() => handleRemove(k)}
                              aria-label={`Remove ${k}`}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button
                type="submit"
                className="mt-2 w-full border border-blue-400/50 bg-blue-500/80 text-sm shadow-lg shadow-blue-900/60 hover:bg-blue-400"
              >
                Save project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
