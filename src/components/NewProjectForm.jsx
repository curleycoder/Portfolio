"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  .min(1)
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image"),
    { message: "Must be a URL (https://...) or /path or data:image..." }
  );

const newProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(500),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string().min(1)).max(20).optional().default([]),
  images: z.array(imageSchema).optional().default([]),
});

export default function NewProjectForm() {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
      keywords: [],
      images: [],
    },
  });

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setFileError("");
    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));

      form.setValue("image", dataUrls[0], { shouldValidate: true });
      setPreview(dataUrls[0]);

      const extras = dataUrls.slice(1);
      if (extras.length) {
        const current = form.getValues("images") || [];
        form.setValue("images", [...current, ...extras], { shouldValidate: true });
      }
    } catch (err) {
      console.error(err);
      setFileError("Failed to read files. Try smaller images or fewer files.");
    }
  }

  async function onSubmit(values) {
    try {
      const res = await fetch("/api/projects/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ keep simple
        body: JSON.stringify(values),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        alert(payload?.error || "Create failed");
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Add a new project
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Admin-only. This adds a project to your portfolio list.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-sm">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">Title</FormLabel>
                    <FormControl>
                      <Input className="border-neutral-700 bg-neutral-950 text-neutral-50" {...field} />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Shown on project cards and the case study header.
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
                    <FormLabel className="text-xs text-neutral-300">Description</FormLabel>
                    <FormControl>
                      <Input className="border-neutral-700 bg-neutral-950 text-neutral-50" {...field} />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Short summary used on listing + detail page.
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
                    <FormLabel className="text-xs text-neutral-300">Image URL or uploaded image</FormLabel>
                    <FormControl>
                      <Input className="border-neutral-700 bg-neutral-950 text-neutral-50" {...field} />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Upload below or paste a URL. First upload becomes the cover.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-xs text-neutral-300">Upload Photos</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="border-neutral-700 bg-neutral-950 text-neutral-50"
                    />
                    {fileError ? <p className="text-[11px] text-red-400">{fileError}</p> : null}

                    {preview ? (
                      <div className="mt-2 inline-flex flex-col gap-1">
                        <span className="text-[11px] text-neutral-400">Main image preview:</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-24 w-auto rounded-md border border-neutral-700 object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </FormControl>
                <FormDescription className="text-[11px] text-neutral-500">
                  First file = cover image. Remaining files go into slider.
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-300">Project link</FormLabel>
                    <FormControl>
                      <Input className="border-neutral-700 bg-neutral-950 text-neutral-50" {...field} />
                    </FormControl>
                    <FormDescription className="text-[11px] text-neutral-500">
                      Deployed project, demo, or main link.
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

                  return (
                    <FormItem>
                      <FormLabel className="text-xs text-neutral-300">Keywords</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            value={draftKeyword}
                            onChange={(e) => setDraftKeyword(e.target.value)}
                            placeholder="Add keyword"
                            className="border-neutral-700 bg-neutral-950 text-neutral-50"
                          />
                          <Button type="button" onClick={handleAdd} className="text-xs">
                            Add
                          </Button>
                        </div>
                      </FormControl>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {current.map((k) => (
                          <Badge
                            key={k}
                            variant="outline"
                            className="flex items-center gap-1 border-neutral-600 text-[11px] text-neutral-200"
                          >
                            {k}
                            <button type="button" className="ml-1 text-xs" onClick={() => handleRemove(k)}>
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

              <Button type="submit" className="mt-2 w-full">
                Save project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
