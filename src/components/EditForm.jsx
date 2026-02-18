"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

function UploadButton({
  label = "Upload",
  accept = "image/*,video/*",
  onUploaded, // (url, file) => void
  disabled,
  multiple = false,
  maxMB = 120, // adjust if you want
}) {
  const [uploading, setUploading] = React.useState(false);

  const pickFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = !!multiple;

    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      setUploading(true);
      try {
        for (const file of files) {
          // client-side size guard
          if (file.size > maxMB * 1024 * 1024) {
            alert(`"${file.name}" is too large. Max ${maxMB}MB.`);
            continue;
          }

          const form = new FormData();
          form.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: form, // ✅ do NOT set Content-Type manually
          });

          const data = await res.json().catch(() => null);
          if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);

          const url = data?.url;
          if (!url) throw new Error("Upload succeeded but no url returned.");

          onUploaded?.(url, file);
        }
      } catch (e) {
        alert(e?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  return (
    <button
      type="button"
      onClick={pickFile}
      disabled={disabled || uploading}
      className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900 disabled:opacity-60"
    >
      {uploading ? "Uploading..." : label}
    </button>
  );
}

const Textarea = React.forwardRef(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600 ${
        props.className || ""
      }`}
    />
  );
});

const InputX = React.forwardRef(function InputX(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600 ${
        props.className || ""
      }`}
    />
  );
});

const safeString = z.any().optional().transform((v) => String(v ?? "").trim());

const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  src: safeString,
  caption: safeString,
});

const highlightSchema = z.object({
  title: safeString,
  caption: safeString,
  image: safeString,
});

const projectSchema = z.object({
  title: safeString,
  shortDescription: safeString,
  description: safeString,

  whyTitle: safeString,
  why: safeString,

  rationaleProblem: safeString,
  rationaleChallenge: safeString,
  rationaleSolution: safeString,

  image: safeString,
  link: safeString,
  githubLink: safeString,
  demoLink: safeString,
  figmaLink: safeString,

  keywords: z.array(safeString).default([]),
  images: z.array(safeString).default([]),

  media: z.array(mediaItemSchema).default([]),
  highlights: z.array(highlightSchema).default([{ title: "", caption: "", image: "" }]),
});

function normalizeDefaults(project) {
  const h = Array.isArray(project?.highlights) ? project.highlights : [];
  const media = Array.isArray(project?.media) ? project.media : [];

  return {
    title: project?.title ?? "",
    shortDescription: project?.shortDescription ?? "",
    description: project?.description ?? "",

    image: project?.image ?? "",
    images: Array.isArray(project?.images) ? project.images : [],

    link: project?.link ?? "",
    githubLink: project?.githubLink ?? "",
    demoLink: project?.demoLink ?? "",
    figmaLink: project?.figmaLink ?? "",

    keywords: Array.isArray(project?.keywords) ? project.keywords : [],

    whyTitle: project?.whyTitle ?? "",
    why: project?.why ?? "",

    rationaleProblem: project?.rationaleProblem ?? "",
    rationaleChallenge: project?.rationaleChallenge ?? "",
    rationaleSolution: project?.rationaleSolution ?? "",

    media: media
      .map((m) => ({
        type: m?.type === "video" ? "video" : "image",
        src: String(m?.src ?? "").trim(),
        caption: String(m?.caption ?? "").trim(),
      }))
      .filter((m) => m.src),

    highlights:
      h.length > 0
        ? [
            {
              title: h[0]?.title ?? "",
              caption: h[0]?.caption ?? "",
              image: h[0]?.image ?? "",
            },
          ]
        : [{ title: "", caption: "", image: "" }],
  };
}

export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftImage, setDraftImage] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: normalizeDefaults(null),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, setValue, watch, reset } = form;

  useEffect(() => {
    if (!project?.id) return;
    reset(normalizeDefaults(project), { keepErrors: false });
  }, [project?.id, reset, project]);

  const keywords = watch("keywords") || [];
  const images = watch("images") || [];
  const cover = watch("image");
  const gallery = watch("images") || [];

  const highlightsFA = useFieldArray({ control: form.control, name: "highlights" });
  const mediaFA = useFieldArray({ control: form.control, name: "media" });

  // Ensure highlight[0]
  useEffect(() => {
    if (!highlightsFA.fields.length) {
      highlightsFA.append({ title: "", caption: "", image: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightsFA.fields.length]);

  const addKeyword = () => {
    const v = String(draftKeyword || "").trim();
    if (!v) return;
    const next = Array.from(new Set([...(keywords || []), v]));
    setValue("keywords", next, { shouldValidate: true });
    setDraftKeyword("");
  };

  const removeKeyword = (k) => {
    setValue(
      "keywords",
      (keywords || []).filter((x) => x !== k),
      { shouldValidate: true }
    );
  };

  const addImage = () => {
    const v = String(draftImage || "").trim();
    if (!v) return;
    const next = Array.from(new Set([...(images || []), v]));
    setValue("images", next, { shouldValidate: true });
    setDraftImage("");
  };

  const removeImage = (src) => {
    setValue(
      "images",
      (images || []).filter((x) => x !== src),
      { shouldValidate: true }
    );
  };

  const rationaleHelp = useMemo(
    () => [
      "Third person only (avoid I / me / we / you).",
      "Generalist tone (non-coders can understand).",
      "100–150 words total (1 paragraph, 2 max).",
      "Explain: what it is + requirements + why the design/flow works.",
      "No spelling/grammar errors (grading penalty).",
    ],
    []
  );

  return (
    <form
      className="space-y-10"
      onSubmit={handleSubmit(async (values) => {
  if (!project?.id) return;

  setSaving(true);
  try {
    // 1) Trim + drop empty strings
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) => {
        if (typeof v === "string") return [k, v.trim()];
        return [k, v];
      })
    );

    // 2) Remove highlight rows that are basically empty
    cleaned.highlights = Array.isArray(cleaned.highlights)
      ? cleaned.highlights
          .map((h) => ({
            title: String(h?.title ?? "").trim(),
            caption: String(h?.caption ?? "").trim(),
            image: String(h?.image ?? "").trim(),
          }))
          .filter((h) => h.image) // keep only valid ones
      : [];

    // 3) Remove media steps with empty src
    cleaned.media = Array.isArray(cleaned.media)
      ? cleaned.media
          .map((m) => ({
            type: m?.type === "video" ? "video" : "image",
            src: String(m?.src ?? "").trim(),
            caption: String(m?.caption ?? "").trim(),
          }))
          .filter((m) => m.src)
      : [];

    // 4) Remove empty keywords/images
    cleaned.keywords = Array.isArray(cleaned.keywords)
      ? cleaned.keywords.map((x) => String(x ?? "").trim()).filter(Boolean)
      : [];

    cleaned.images = Array.isArray(cleaned.images)
      ? cleaned.images.map((x) => String(x ?? "").trim()).filter(Boolean)
      : [];

    // 5) IMPORTANT:
    // If your DB columns are json/text and expect stringified JSON, uncomment these:
    // cleaned.keywords = JSON.stringify(cleaned.keywords);
    // cleaned.images = JSON.stringify(cleaned.images);
    // cleaned.media = JSON.stringify(cleaned.media);
    // cleaned.highlights = JSON.stringify(cleaned.highlights);

    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Save failed:", payload);
      alert(payload?.detail || payload?.error || `Save failed (${res.status})`);
      return;
    }

    router.push(`/projects/${project.id}?t=${Date.now()}`);
    router.refresh();
  } catch (err) {
    console.error(err);
    alert("Save failed (network/server error)");
  } finally {
    setSaving(false);
  }
})}

    >
      {/* BASICS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          basics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-neutral-400">Title</label>
            <InputX {...register("title")} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-neutral-400">Short description</label>
            <InputX
              {...register("shortDescription")}
              placeholder="1–2 lines: what it is + outcome"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-neutral-400">
              What it does (one bullet per line)
            </label>
            <Textarea {...register("description")} rows={6} />
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          links
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-neutral-400">Live link</label>
            <InputX {...register("link")} placeholder="https://…" />
          </div>
          <div>
            <label className="text-xs text-neutral-400">GitHub</label>
            <InputX {...register("githubLink")} placeholder="https://github.com/…" />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Demo / Prototype</label>
            <InputX {...register("demoLink")} placeholder="https://…" />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Figma</label>
            <InputX {...register("figmaLink")} placeholder="https://…" />
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          tech stack
        </h2>

        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => removeKeyword(k)}
              className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 font-mono text-[10px] text-neutral-200 hover:bg-neutral-900"
              title="Remove"
            >
              {k} <span className="opacity-60">×</span>
            </button>
          ))}

          {!keywords.length ? (
            <p className="text-sm text-neutral-500">
              Add stack keywords (Expo, Hono, Drizzle, Neon, Clerk, GenAI…).
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <InputX
            value={draftKeyword}
            onChange={(e) => setDraftKeyword(e.target.value)}
            placeholder="Add keyword e.g. Expo"
          />
          <Button type="button" onClick={addKeyword} className="bg-neutral-100 text-neutral-900 hover:bg-white">
            Add
          </Button>
        </div>
      </section>

      {/* IMAGES */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          images
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Main cover image</label>
            <InputX {...register("image")} placeholder="/forge.png or https://…" />
            {cover ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="Cover preview" className="h-[200px] w-full object-cover" />
              </div>
              
            ) : null}
            <UploadButton
  label="Upload cover"
  accept="image/*"
  disabled={saving}
  onUploaded={(url) => setValue("image", url, { shouldValidate: true })}
/>

          </div>

          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-3">
            <p className="mb-2 text-xs text-neutral-400">Extra gallery images (for slider)</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {gallery.map((src) => (
                <div key={src} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Gallery preview" className="h-[160px] w-full rounded-lg object-cover" />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                    onClick={() => removeImage(src)}
                  >
                    Remove
                  </Button>
                </div>
                
              ))}

              {!gallery.length ? (
                <p className="text-sm text-neutral-500">Add screenshots used in the hero slider.</p>
              ) : null}
            </div>
            <div className="mt-3">
  <UploadButton
    label="Upload gallery image"
    accept="image/*"
    disabled={saving}
    onUploaded={(url) => {
      const current = watch("images") || [];
      setValue("images", Array.from(new Set([...current, url])), { shouldValidate: true });
    }}
  />
</div>

            <div className="mt-3 flex gap-2">
              <InputX
                value={draftImage}
                onChange={(e) => setDraftImage(e.target.value)}
                placeholder="Paste image URL/path"
              />
              <Button
                type="button"
                onClick={addImage}
                variant="outline"
                className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              how it works
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Show the interaction flow. Supports raw <span className="font-mono">.mp4</span>.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
            onClick={() => mediaFA.append({ type: "image", src: "", caption: "" })}
          >
            + Add step
          </Button>
        </div>

        {mediaFA.fields.length ? (
          <div className="space-y-4">
            {mediaFA.fields.map((f, idx) => (
              <div key={f.id} className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-mono text-neutral-400">
                    step {String(idx + 1).padStart(2, "0")}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                      disabled={idx === 0}
                      onClick={() => mediaFA.move(idx, idx - 1)}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                      disabled={idx === mediaFA.fields.length - 1}
                      onClick={() => mediaFA.move(idx, idx + 1)}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-800 bg-transparent text-red-200 hover:bg-neutral-900"
                      onClick={() => mediaFA.remove(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-neutral-400">Type</label>
                    <select
                      {...register(`media.${idx}.type`)}
                      className="mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600"
                    >
                      <option value="image">image</option>
                      <option value="video">video</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-neutral-400">Source</label>
                    <InputX {...register(`media.${idx}.src`)} placeholder="/forge-flow.mp4 or https://…" />
                      <div className="mt-2">
                      <UploadButton
                        label="Upload step (image/video)"
                        accept="image/*,video/*"
                        disabled={saving}
                        onUploaded={(url, file) => {
                          const isVideo = file.type.startsWith("video/");
                          setValue(`media.${idx}.type`, isVideo ? "video" : "image", { shouldValidate: true });
                          setValue(`media.${idx}.src`, url, { shouldValidate: true });
                        }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs text-neutral-400">Caption</label>
                    <Textarea {...register(`media.${idx}.caption`)} rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Add 3–6 steps (map click → exploration → AI Q&amp;A).
          </p>
        )}
      </section>

      {/* RATIONALE (assignment rules) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          rationale (grading rules)
        </h2>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4">
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            {rationaleHelp.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-neutral-400">Context (what it is / who for)</label>
            <Textarea {...register("rationaleProblem")} rows={5} />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Requirements (constraints)</label>
            <Textarea {...register("rationaleChallenge")} rows={5} />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Outcome (why it looks/works this way)</label>
            <Textarea {...register("rationaleSolution")} rows={5} />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            highlights
          </h2>
          <Button
            type="button"
            variant="outline"
            className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
            onClick={() => highlightsFA.append({ title: "", caption: "", image: "" })}
          >
            + Add highlight
          </Button>
        </div>

        {highlightsFA.fields[0] ? (
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4">
            <p className="text-xs font-mono text-neutral-400">highlight 1</p>

            <div className="mt-3 grid gap-3">
              <div>
                <label className="text-xs text-neutral-400">Title</label>
                <InputX {...register("highlights.0.title")} />
              </div>

              <div>
                <label className="text-xs text-neutral-400">Image</label>
                <InputX {...register("highlights.0.image")} placeholder="/forge-highlight.png or https://…" />
              </div>

              <div>
                <label className="text-xs text-neutral-400">Caption</label>
                <Textarea {...register("highlights.0.caption")} rows={3} />
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* SAVE */}
      <div className="flex justify-end gap-2 border-t border-neutral-800/80 pt-5">
        <Button
          type="submit"
          disabled={saving}
          className="bg-neutral-100 text-neutral-900 hover:bg-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

export { Textarea, InputX };
