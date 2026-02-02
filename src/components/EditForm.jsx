"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
    {
      message:
        "Must be a URL (https://...) or a local path (/...) or an uploaded image (data:image/...).",
    }
  );

const projectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(500),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string()).default([]),
  images: z.array(imageSchema).optional().default([]),
});

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [draftKeyword, setDraftKeyword] = useState("");
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(project?.image || null);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      image: project?.image ?? "",
      link: project?.link ?? "",
      keywords: project?.keywords ?? [],
      images: project?.images ?? [],
    },
  });

  const gallery = form.watch("images") || [];

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setFileError("");

    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));

      // first file => main image
      form.setValue("image", dataUrls[0], { shouldValidate: true });
      setPreview(dataUrls[0]);

      // remaining => append to gallery
      const extras = dataUrls.slice(1);
      if (extras.length) {
        const current = form.getValues("images") || [];
        form.setValue("images", [...current, ...extras], {
          shouldValidate: true,
        });
      }

      // allow selecting same file again later
      e.target.value = "";
    } catch (err) {
      console.error(err);
      setFileError("Failed to read files. Try smaller images or fewer files.");
    }
  }

  const onSubmit = async (values) => {
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("image", values.image);
      fd.append("link", values.link);

      (values.keywords || []).forEach((k) => fd.append("keywords", k));
      (values.images || []).forEach((img) => fd.append("images", img));

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH", 
        body: fd,
      });

      const text = await res.text();

      if (!res.ok) {
        alert("Update failed");
        console.error("Update error:", res.status, text);
        return;
      }

      alert("Project Updated!");
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (e) {
      alert("Update failed");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">
                Project Title
              </FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="My awesome project"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                Shown on cards and the details page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">
                Project Description
              </FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="Brief summary of your project"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                For Class05, rewrite this as a third-person rationale (100–150
                words) or add a separate rationale field later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MAIN IMAGE */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">
                Main Image (URL or uploaded)
              </FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="https://... or /projects/..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                Hero image used on cards and at the top of the project page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FILE UPLOADS */}
        <FormItem>
          <FormLabel className="text-xs text-neutral-300">
            Upload Images
          </FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="border-neutral-700 bg-neutral-950 text-neutral-50 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/80 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-400"
              />

              {fileError && (
                <p className="text-xs text-red-400">{fileError}</p>
              )}

              {preview && (
                <div className="mt-2 inline-flex flex-col gap-1">
                  <span className="text-[11px] text-neutral-500">
                    Main image preview:
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Main preview"
                    className="h-24 w-auto rounded-md border border-neutral-700 object-cover"
                  />
                </div>
              )}

              {/* GALLERY */}
              {gallery.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] text-neutral-500">
                    Gallery images:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {gallery.map((src, idx) => (
                      <div key={`${src}-${idx}`} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Gallery ${idx + 1}`}
                          className="h-20 w-28 rounded-md border border-neutral-700 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = gallery.filter((_, i) => i !== idx);
                            form.setValue("images", next, {
                              shouldValidate: true,
                            });
                          }}
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full border border-neutral-700 bg-neutral-950 text-xs text-neutral-200 hover:bg-neutral-900"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription className="text-[11px] text-neutral-500">
            Select one or more images. First becomes main image. Others append
            to the gallery.
          </FormDescription>
        </FormItem>

        {/* LINK */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">
                Project Link
              </FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="https://your-project-link.com"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                Deployed site or demo URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* KEYWORDS */}
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

            const handleRemove = (value) => {
              field.onChange(current.filter((k) => k !== value));
            };

            return (
              <FormItem>
                <FormLabel className="text-xs text-neutral-300">
                  Keywords
                </FormLabel>
                <FormDescription className="text-[11px] text-neutral-500">
                  Add tags for filtering (e.g. Next.js, React Native, UI/UX).
                </FormDescription>

                <div className="mt-1 flex gap-2">
                  <Input
                    className="border-neutral-700 bg-neutral-950 text-neutral-50"
                    placeholder="Type a keyword and press Enter"
                    value={draftKeyword}
                    onChange={(e) => setDraftKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                  />
                  <Button
                    className="border border-blue-500/80"
                    type="button"
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {current.map((value) => (
                    <Badge
                      key={value}
                      variant="outline"
                      className="flex items-center gap-1 border-neutral-600 text-[11px] text-neutral-200"
                    >
                      {value}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={() => handleRemove(value)}
                        aria-label={`Remove ${value}`}
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
          disabled={saving}
          className="mt-2 w-full border border-blue-500/80"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
