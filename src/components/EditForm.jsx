"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

/** forwardRef wrappers (fixes the ref warning from react-hook-form) */
const Textarea = React.forwardRef(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={
        props.className ??
        "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-700"
      }
    />
  );
});

const InputX = React.forwardRef(function InputX(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={
        props.className ??
        "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-700"
      }
    />
  );
});

/** schema */
const safeString = z.any().optional().transform((v) => String(v ?? "").trim());

const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  src: safeString,
  caption: safeString,
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

  /** ✅ NEW: flow steps */
  media: z.array(mediaItemSchema).default([]),

  highlights: z
    .array(
      z.object({
        title: safeString,
        caption: safeString,
        image: safeString,
      })
    )
    .default([{ title: "", caption: "", image: "" }]),
});

function normalizeDefaults(project) {
  const h = Array.isArray(project?.highlights) ? project.highlights : [];
  const m = Array.isArray(project?.media) ? project.media : [];

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

    /** ✅ NEW */
    media: m
      .map((x) => ({
        type: x?.type === "video" ? "video" : "image",
        src: String(x?.src ?? "").trim(),
        caption: String(x?.caption ?? "").trim(),
      }))
      .filter((x) => x.src),

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

function guessMediaType(src) {
  const s = String(src || "").toLowerCase();
  return s.endsWith(".mp4") ? "video" : "image";
}

function MediaPreview({ item, title }) {
  const type = item?.type === "video" ? "video" : "image";
  const src = String(item?.src ?? "").trim();
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60">
      <div className="relative aspect-video w-full bg-neutral-900">
        {type === "video" ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            muted
            controls
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={title || "media"} className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}

export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftImage, setDraftImage] = useState("");

  /** ✅ NEW: flow draft */
  const [draftFlowSrc, setDraftFlowSrc] = useState("");
  const [draftFlowCaption, setDraftFlowCaption] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: normalizeDefaults(null),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, setValue, watch, formState, reset, trigger } = form;
  const { errors } = formState;

  useEffect(() => {
    if (!project?.id) return;

    reset(normalizeDefaults(project), {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
    });

    trigger();
  }, [project?.id, reset, trigger, project]);

  const keywords = watch("keywords") || [];
  const images = watch("images") || [];
  const cover = watch("image");
  const gallery = watch("images") || [];

  /** ✅ NEW */
  const mediaFA = useFieldArray({
    control: form.control,
    name: "media",
  });

  const highlightsFA = useFieldArray({
    control: form.control,
    name: "highlights",
  });

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

  /** ✅ NEW: flow add */
  const addFlowStep = () => {
    const src = String(draftFlowSrc || "").trim();
    const caption = String(draftFlowCaption || "").trim();
    if (!src) return;

    mediaFA.append({
      type: guessMediaType(src),
      src,
      caption,
    });

    setDraftFlowSrc("");
    setDraftFlowCaption("");
  };

  const moveFlowUp = (idx) => {
    if (idx <= 0) return;
    mediaFA.move(idx, idx - 1);
  };

  const moveFlowDown = (idx) => {
    if (idx >= mediaFA.fields.length - 1) return;
    mediaFA.move(idx, idx + 1);
  };

  return (
    <form
      className="space-y-10"
      onSubmit={handleSubmit(async (values) => {
        if (!project?.id) return;

        setSaving(true);
        try {
          const res = await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          const text = await res.text();
          let payload = null;
          try {
            payload = JSON.parse(text);
          } catch {}

          if (!res.ok) {
            alert(payload?.error || `Save failed (${res.status})`);
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

        <div className="grid gap-3">
          <div>
            <label className="text-xs text-neutral-400">Title</label>
            <InputX {...register("title")} />
            {errors.title ? (
              <p className="mt-1 text-xs text-red-300">{String(errors.title.message)}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-neutral-400">Short description</label>
            <InputX {...register("shortDescription")} placeholder="1–2 lines: what it is + outcome" />
          </div>

          <div>
            <label className="text-xs text-neutral-400">What It Does</label>
            <Textarea {...register("description")} rows={5} />
            <p className="mt-1 text-xs text-neutral-500">
              Tip: one bullet per line (matches the Project page).
            </p>
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
            <InputX {...register("figmaLink")} placeholder="https://figma.com/…" />
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          stack
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
            <p className="text-sm text-neutral-500">Add keywords (Expo, Hono, Drizzle, Neon, GenAI…).</p>
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

      {/* HERO + GALLERY IMAGES */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          images
        </h2>

        <div>
          <label className="text-xs text-neutral-400">Main cover image</label>
          <InputX {...register("image")} placeholder="https://… or /path" />

          {cover ? (
            <div className="mt-2 overflow-hidden rounded-xl border border-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="Cover preview" className="h-[180px] w-full object-cover" />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4">
          <p className="mb-2 text-xs text-neutral-400">Gallery images</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {gallery.map((src) => (
              <div key={src} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Gallery preview" className="aspect-video w-full rounded-lg object-cover" />

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
              <p className="text-sm text-neutral-500">Add screenshots for the hero slider.</p>
            ) : null}
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
      </section>

      {/* ✅ FLOW (MEDIA) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            how it works (flow)
          </h2>
          <p className="text-xs text-neutral-500">
            Add steps (images or raw .mp4). Reorder to match the story.
          </p>
        </div>

        {/* add step */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4 space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Step media src</label>
            <InputX
              value={draftFlowSrc}
              onChange={(e) => setDraftFlowSrc(e.target.value)}
              placeholder='e.g. "/forge-flow.mp4" or "/forge-map.png"'
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">Caption (optional)</label>
            <Textarea
              value={draftFlowCaption}
              onChange={(e) => setDraftFlowCaption(e.target.value)}
              rows={2}
              placeholder="What is happening in this step?"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={addFlowStep}
              className="bg-neutral-100 text-neutral-900 hover:bg-white"
            >
              Add step
            </Button>
          </div>
        </div>

        {/* steps list */}
        <div className="space-y-4">
          {!mediaFA.fields.length ? (
            <p className="text-sm text-neutral-500">
              No flow steps yet. Add 3–6 steps for a “hen-ry” style project story.
            </p>
          ) : null}

          {mediaFA.fields.map((field, idx) => (
            <div
              key={field.id}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-mono text-neutral-400">
                  step {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                    onClick={() => moveFlowUp(idx)}
                    disabled={idx === 0}
                  >
                    ↑
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                    onClick={() => moveFlowDown(idx)}
                    disabled={idx === mediaFA.fields.length - 1}
                  >
                    ↓
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
                    onClick={() => mediaFA.remove(idx)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* type */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-neutral-400">Type</label>
                  <select
                    {...register(`media.${idx}.type`)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-700"
                  >
                    <option value="image">image</option>
                    <option value="video">video (.mp4)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400">Src</label>
                  <InputX {...register(`media.${idx}.src`)} placeholder="/forge-flow.mp4" />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400">Caption</label>
                <Textarea {...register(`media.${idx}.caption`)} rows={2} />
              </div>

              <MediaPreview item={watch(`media.${idx}`)} title={project?.title} />
            </div>
          ))}
        </div>
      </section>

      {/* RATIONALE */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          rationale
        </h2>

        <div className="grid gap-3">
          <div>
            <label className="text-xs text-neutral-400">Problem</label>
            <Textarea {...register("rationaleProblem")} rows={4} />
          </div>

          <div>
            <label className="text-xs text-neutral-400">Challenge</label>
            <Textarea {...register("rationaleChallenge")} rows={4} />
          </div>

          <div>
            <label className="text-xs text-neutral-400">Solution</label>
            <Textarea {...register("rationaleSolution")} rows={4} />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS (keep your current simple “1 highlight” approach) */}
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
                <InputX {...register("highlights.0.image")} placeholder="https://… or /path" />
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
