"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const safeString = z.any().optional().transform((v) => String(v ?? "").trim());

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

// allow empty OR a valid URL
const urlOrEmpty = z
  .string()
  .optional()
  .transform((v) => String(v ?? "").trim())
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), {
    message: "Must be empty or a valid URL (https://...)",
  });

const newProjectSchema = z.object({
  title: z.string().min(2).max(200),

  // match edit form
  shortDescription: safeString,
  description: safeString,     // bullets, one per line (same as edit)
  betterThan: safeString,

  repoYear: z
    .union([z.number().int().min(2000).max(2100), z.nan()])
    .optional()
    .transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : undefined)),

  logo: safeString,

  image: imageSchema,
  link: urlOrEmpty,
  githubLink: urlOrEmpty,
  demoLink: urlOrEmpty,
  figmaLink: urlOrEmpty,

  keywords: z.array(z.string().min(1)).max(30).optional().default([]),
  images: z.array(imageSchema).optional().default([]),

  // keep structure compatible with edit even if you don’t show UI yet
  whyTitle: safeString,
  why: safeString,
  rationaleProblem: safeString,
  rationaleChallenge: safeString,
  rationaleSolution: safeString,

  media: z.array(z.any()).optional().default([]),
  highlights: z.array(z.any()).optional().default([]),
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
    shortDescription: "",
    description: "",
    betterThan: "",
    repoYear: undefined,

    logo: "",

    image: "",
    link: "",
    githubLink: "",
    demoLink: "",
    figmaLink: "",

    keywords: [],
    images: [],

    whyTitle: "",
    why: "",
    rationaleProblem: "",
    rationaleChallenge: "",
    rationaleSolution: "",

    media: [],
    highlights: [],
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
    const t = toast.loading("Saving project…");
    try {
      const res = await fetch("/api/projects/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.error || "Create failed.");
        toast.dismiss(t);
        return;
      }

      toast.success("Project saved.");
      toast.dismiss(t);
      router.push("/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Submit failed.");
      toast.dismiss(t);
    }
  }

  return (
    <div className="pt-10 sm:pt-14 lg:pt-18">
      <div className="mx-auto max-w-5xl space-y-5 px-4 md:px-6">
        {/* Header */}
        <header className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Admin
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[-0.02em]">
            Add a new project
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            This adds a project to your portfolio list.
          </p>
        </header>

        {/* Form Card */}
        <section
          className="
            relative overflow-hidden rounded-2xl border border-border
            bg-card/70 text-card-foreground backdrop-blur
            shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          "
        >
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

          <div className="p-5 sm:p-6">
            <Form {...form}>
              <form
  onSubmit={form.handleSubmit(
    onSubmit,
    (errors) => {
      console.log("FORM INVALID:", errors);
      // optional: show a toast/alert for debugging
      alert(Object.keys(errors).length ? `Fix: ${Object.keys(errors).join(", ")}` : "Invalid form");
    }
  )}
  className="space-y-5 text-sm"
>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Shown on project cards and the case study header.
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-end justify-between">
        <FormLabel className="text-xs text-neutral-300">Description</FormLabel>
        <span className="text-[11px] text-neutral-500">
          {(field.value?.length ?? 0)}/500
        </span>
      </div>

      <FormControl>
        <Textarea
          {...field}
          maxLength={500}
          rows={4}
          placeholder="Short summary (max 500 characters)"
          className="border-neutral-700 bg-neutral-950 text-neutral-50"
        />
      </FormControl>

      <FormDescription className="text-[11px] text-neutral-500">
        This shows on cards + detail page.
      </FormDescription>

      <FormMessage className="text-xs text-red-400" />
    </FormItem>
  )}
/>


                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Cover Image URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://… or /path or data:image…" {...field} />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Upload below or paste a URL. First upload becomes the cover.
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Upload Photos
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input type="file" accept="image/*" multiple onChange={handleFilesChange} />
                      {fileError ? <p className="text-[11px] text-destructive">{fileError}</p> : null}

                      {preview ? (
                        <div className="mt-2 inline-flex flex-col gap-2">
                          <span className="text-[11px] text-muted-foreground">Main image preview:</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Preview"
                            className="h-24 w-auto rounded-xl border border-border object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormDescription className="text-[11px] text-muted-foreground">
                    First file = cover image. Remaining files go into slider.
                  </FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Project link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Deployed project, demo, or main link.
                      </FormDescription>
                      <FormMessage className="text-xs" />
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
                      if (!v) return;
                      if (current.map((x) => x.toLowerCase()).includes(v.toLowerCase())) return;
                      field.onChange([...current, v]);
                      setDraftKeyword("");
                    };

                    const handleRemove = (k) => {
                      field.onChange(current.filter((x) => x !== k));
                    };

                    return (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Keywords
                        </FormLabel>

                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              value={draftKeyword}
                              onChange={(e) => setDraftKeyword(e.target.value)}
                              placeholder="Add keyword (e.g. Next.js, Neon, Auth0)"
                            />
                            <Button type="button" onClick={handleAdd} size="sm">
                              Add
                            </Button>
                          </div>
                        </FormControl>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {current.map((k) => (
                            <Badge key={k} variant="outline" className="rounded-full border-border bg-card/30 text-[11px]">
                              {k}
                              <button
                                type="button"
                                className="ml-2 opacity-70 hover:opacity-100"
                                onClick={() => handleRemove(k)}
                                aria-label={`Remove ${k}`}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <FormMessage className="text-xs" />
                      </FormItem>
                    );
                  }}
                />
                <FormField
  control={form.control}
  name="shortDescription"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Short description
      </FormLabel>
      <FormControl>
        <Input {...field} placeholder="1–2 lines: what it is + outcome" />
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="betterThan"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Better than alternatives (one bullet per line)
      </FormLabel>
      <FormControl>
        <Textarea {...field} rows={4} placeholder="- Faster load\n- Cleaner UX\n- ..." />
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="repoYear"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Year created
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          min="2000"
          max="2100"
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          placeholder="2025"
        />
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  )}
/>

                <Button type="submit" className="mt-2 w-full rounded-xl">
                  Save project
                </Button>
              </form>
            </Form>
          </div>
        </section>

        <div className="h-10" />
      </div>
    </div>
  );
}