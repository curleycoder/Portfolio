"use client";

import { useMemo, useState } from "react";
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
import GallerySlider from "@/components/GallerySlider";

// ✅ Local Textarea component (no shadcn install needed)
function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={[
        "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-50",
        "outline-none focus:border-neutral-500 focus:ring-0",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

// -------------------------
// Helpers
// -------------------------
function wordCount(s) {
  return String(s || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function isLikelyImageSrc(val) {
  return (
    typeof val === "string" &&
    (val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image"))
  );
}

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!x) continue;
    const v = String(x).trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

const imageSchema = z
  .string()
  .min(1)
  .refine(isLikelyImageSrc, {
    message:
      "Must be a URL (https://...) or a local path (/...) or an uploaded image (data:image/...).",
  });

const optionalImageSchema = z
  .string()
  .optional()
  .default("")
  .refine((val) => !val || isLikelyImageSrc(val), {
    message:
      "Must be empty or a URL (https://...) or a local path (/...) or an uploaded image (data:image/...).",
  });

const highlightSchema = z.object({
  title: z.string().max(80).optional().default(""),
  image: optionalImageSchema,
  caption: z.string().max(220).optional().default(""),
});

const projectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(500),

  rationale: z
    .string()
    .min(1, "Rationale is required for Class 05 (100–150 words).")
    .max(1200),

  highlights: z.array(highlightSchema).default([]),

  image: imageSchema, // main
  link: z.string().url(),
  keywords: z.array(z.string()).default([]),
  images: z.array(imageSchema).optional().default([]), // gallery
});

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


export default function EditProjectForm({ project }) {
  const router = useRouter();

  const [draftKeyword, setDraftKeyword] = useState("");
  const [fileError, setFileError] = useState("");
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

      // Assignment defaults
      rationale: project?.rationale ?? project?.description ?? "",
      highlights: Array.isArray(project?.highlights) ? project.highlights : [],
    },
    mode: "onBlur",
  });

  const main = form.watch("image") || "";
  const gallery = form.watch("images") || [];
  const highlights = form.watch("highlights") || [];
  const rationaleValue = form.watch("rationale") || "";
  const rationaleWC = useMemo(() => wordCount(rationaleValue), [rationaleValue]);

  const keywords = form.watch("keywords") || [];
  const linkValue = form.watch("link") || "";

  // ✅ Detect mobile from keywords (same approach as your detail page)
  const isMobile = useMemo(() => {
    const ks = (keywords || []).map((k) => String(k).toLowerCase());
    return (
      ks.some((k) => k.includes("react-native")) ||
      ks.some((k) => k.includes("expo")) ||
      ks.some((k) => k.includes("mobile"))
    );
  }, [keywords]);

  const linkText =
    linkValue?.replace(/^https?:\/\//, "") || "localhost:3000";

  // ✅ GallerySlider input: [main, ...gallery] (deduped)
  const heroImages = useMemo(
    () => dedupe([main, ...(gallery || [])]).filter(Boolean),
    [main, gallery]
  );

  // -------------------------
  // Image management rules
  // -------------------------
  const setAsMain = (src) => {
    const s = String(src || "").trim();
    if (!s) return;

    const currentMain = String(form.getValues("image") || "").trim();
    const currentGallery = form.getValues("images") || [];

    // remove chosen src from gallery (if exists)
    let nextGallery = currentGallery.filter((x) => String(x).trim() !== s);

    // move old main into gallery (if different)
    if (currentMain && currentMain !== s) {
      nextGallery = [currentMain, ...nextGallery];
    }

    form.setValue("image", s, { shouldValidate: true, shouldDirty: true });
    form.setValue("images", dedupe(nextGallery), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeImage = (src) => {
    const s = String(src || "").trim();
    if (!s) return;

    const currentMain = String(form.getValues("image") || "").trim();
    const currentGallery = form.getValues("images") || [];

    // Removing main -> promote first gallery image (if any)
    if (currentMain === s) {
      const nextGallery = currentGallery.filter((x) => String(x).trim() !== s);
      const promoted = String(nextGallery[0] || "").trim();

      if (promoted) {
        form.setValue("image", promoted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("images", nextGallery.slice(1), {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        // No images left (this will fail schema if you submit, which is fine)
        form.setValue("image", "", { shouldValidate: true, shouldDirty: true });
        form.setValue("images", [], { shouldValidate: true, shouldDirty: true });
      }
      return;
    }

    // Removing a gallery image
    const next = currentGallery.filter((x) => String(x).trim() !== s);
    form.setValue("images", next, { shouldValidate: true, shouldDirty: true });
  };

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setFileError("");
    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));

      const currentMain = String(form.getValues("image") || "").trim();
      const currentGallery = form.getValues("images") || [];

      // if no main: first becomes main, rest go to gallery
      if (!currentMain) {
        form.setValue("image", dataUrls[0], {
          shouldValidate: true,
          shouldDirty: true,
        });

        const extras = dataUrls.slice(1);
        if (extras.length) {
          form.setValue("images", dedupe([...currentGallery, ...extras]), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } else {
        // main exists -> all uploads append to gallery
        form.setValue("images", dedupe([...currentGallery, ...dataUrls]), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      e.target.value = "";
    } catch (err) {
      console.error(err);
      setFileError("Failed to read files. Try smaller images or fewer files.");
    }
  }

  // -------------------------
  // Highlights helpers
  // -------------------------
  const addHighlight = () => {
  const nextIndex = highlights.length + 1;
  const next = [
    ...highlights,
    { title: `Highlight ${nextIndex}`, image: "", caption: "" },
  ];
  form.setValue("highlights", next, { shouldValidate: true });
};


  const removeHighlight = (idx) => {
    const next = highlights.filter((_, i) => i !== idx);
    form.setValue("highlights", next, { shouldValidate: true, shouldDirty: true });
  };

  // -------------------------
  // Submit
  // -------------------------
  const onSubmit = async (values) => {
    setSaving(true);

    // Assignment guardrails
    const wc = wordCount(values.rationale);
    if (wc < 100 || wc > 150) {
      alert("Rationale must be 100–150 words for Class 05.");
      setSaving(false);
      return;
    }

    if (!values.image) {
      alert("Main image is required. Remove less or set another image as main.");
      setSaving(false);
      return;
    }

    if (!values.highlights || values.highlights.length < 3) {
      alert("Add at least 3 highlight blocks (image + short caption).");
      setSaving(false);
      return;
    }

    const badHighlight = values.highlights.some((h) => {
      const img = String(h?.image || "").trim();
      const cap = String(h?.caption || "").trim();
      return !img || !cap;
    });

    if (badHighlight) {
      alert("Each highlight must include an image and a short caption.");
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("image", values.image);
      fd.append("link", values.link);

      fd.append("rationale", values.rationale);
      fd.append("highlights", JSON.stringify(values.highlights));

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
        setSaving(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ✅ PREVIEW: matches GallerySlider (web browser frame) */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
            Preview
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Uses the same GallerySlider as your project page. Web projects use object-contain for full screenshots.
          </p>

          <div className="mt-3">
            <GallerySlider
              title={form.watch("title") || "Project"}
              isMobile={isMobile}
              linkText={linkText}
              images={heroImages}
              showControlsWhenSingle
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
            <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5">
              Main: {main ? (main.startsWith("data:image") ? "data:image..." : "set") : "none"}
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5">
              Total images: {heroImages.length}
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5">
              Mode: {isMobile ? "Mobile frame" : "Web frame"}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">Project Title</FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="My awesome project"
                  {...field}
                />
              </FormControl>
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
              <FormLabel className="text-xs text-neutral-300">Short Description</FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="Brief summary shown on cards"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                Keep this short. The assignment writing belongs in “Rationale”.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RATIONALE */}
        <FormField
          control={form.control}
          name="rationale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">
                Rationale (Class 05 — required)
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[140px]"
                  placeholder="Write 100–150 words in third person. No “I/we/you”. General audience."
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-neutral-500">
                Target: 100–150 words. Current:{" "}
                <span
                  className={
                    rationaleWC < 100 || rationaleWC > 150
                      ? "text-amber-300"
                      : "text-emerald-300"
                  }
                >
                  {rationaleWC}
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MAIN IMAGE INPUT */}
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
                Main is the FIRST image in the slider. Use “Set as main” below to control it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* UPLOADS + IMAGE MANAGER */}
        <FormItem>
          <FormLabel className="text-xs text-neutral-300">Upload Images</FormLabel>
          <FormControl>
            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="border-neutral-700 bg-neutral-950 text-neutral-50 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/80 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-400"
              />

              {fileError ? <p className="text-xs text-red-400">{fileError}</p> : null}

              {/* ✅ Unified list = main + gallery (so you can manage everything consistently) */}
              {heroImages.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-500">
                    Images (main + gallery). Remove any. If you remove main, the next image becomes main.
                  </span>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {heroImages.map((src, idx) => {
                      const isMain = String(src).trim() === String(main).trim();
                      return (
                        <div
                          key={`${src}-${idx}`}
                          className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-2"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Image ${idx + 1}`}
                            className="h-28 w-full rounded-lg border border-neutral-800 object-cover"
                          />

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-neutral-400">
                              {isMain ? "Main" : "Gallery"}
                            </span>

                            <div className="flex gap-2">
                              {!isMain && (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="border border-blue-500/80"
                                  onClick={() => setAsMain(src)}
                                >
                                  Set as main
                                </Button>
                              )}

                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="border-neutral-700 text-neutral-600"
                                onClick={() => removeImage(src)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No images yet.</p>
              )}
            </div>
          </FormControl>

          <FormDescription className="text-[11px] text-neutral-500">
            Upload screenshots for the hero slider and/or highlight sections.
          </FormDescription>
        </FormItem>

        {/* HIGHLIGHTS */}
        <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Highlights (Class 05 — required)
              </p>
              <p className="text-[11px] text-neutral-500">
                Add 3–5 highlight blocks. Each should have an image + 1–2 line caption.
              </p>
            </div>

            <Button type="button" onClick={addHighlight} className="border border-blue-500/80">
              Add Highlight
            </Button>
          </div>

          {highlights.length === 0 ? (
            <p className="text-sm text-neutral-400">No highlights yet — add at least 3.</p>
          ) : (
            <div className="space-y-4">
              {highlights.map((_, idx) => (
                <div
                  key={idx}
                  className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-200">
  {String(form.getValues(`highlights.${idx}.title`) || "").trim() || `Highlight ${idx + 1}`}
</p>

                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-700 text-neutral-600"
                      onClick={() => removeHighlight(idx)}
                    >
                      Remove
                    </Button>
                  </div>

                  <FormField
  control={form.control}
  name={`highlights.${idx}.image`}
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-xs text-neutral-300">
        Highlight Image
      </FormLabel>

      {/* Upload */}
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const dataUrl = await fileToDataUrl(file);
            field.onChange(dataUrl);
            e.target.value = "";
          }}
          className="border-neutral-700 bg-neutral-950 text-neutral-50 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/80 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-400"
        />
      </FormControl>

      {/* Preview */}
      {field.value && (
        <div className="mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={field.value}
            alt="Highlight preview"
            className="h-24 w-auto rounded-md border border-neutral-700 object-cover"
          />
        </div>
      )}

      {/* Optional manual input */}
      <FormControl>
        <Input
          className="mt-2 border-neutral-700 bg-neutral-950 text-neutral-50"
          placeholder="Or paste image URL / data:image..."
          value={field.value || ""}
          onChange={field.onChange}
        />
      </FormControl>

      <FormDescription className="text-[11px] text-neutral-500">
        Upload an image from your computer or paste a URL.
      </FormDescription>

      <FormMessage />
    </FormItem>
  )}
/>


                  <FormField
  control={form.control}
  name={`highlights.${idx}.image`}
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-xs text-neutral-300">
        Image (URL or data:image)
      </FormLabel>
      <FormControl>
        <Input
          className="border-neutral-700 bg-neutral-950 text-neutral-50"
          placeholder="Paste an image URL or data:image..."
          {...field}
        />
      </FormControl>
      <FormDescription className="text-[11px] text-neutral-500">
        Use one of your uploaded gallery images (copy the src) or paste a URL.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


                  <FormField
                    control={form.control}
                    name={`highlights.${idx}.caption`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-neutral-300">Caption</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px]"
                            placeholder="1–2 lines describing what this shows (general audience)."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LINK */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-neutral-300">Project Link</FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-950 text-neutral-50"
                  placeholder="https://your-project-link.com"
                  {...field}
                />
              </FormControl>
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
                <FormLabel className="text-xs text-neutral-300">Keywords</FormLabel>
                <FormDescription className="text-[11px] text-neutral-500">
                  Add “Expo / React Native / Mobile” to show phone frame. Otherwise web frame stays.
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
                  <Button className="border border-blue-500/80" type="button" onClick={handleAdd}>
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
