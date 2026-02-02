"use client";

import { useEffect, useMemo, useState } from "react";
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

/* -------------------------
   Local Textarea
------------------------- */
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

/* -------------------------
   Helpers
------------------------- */
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
  return (arr || []).filter((x) => {
    const v = String(x || "").trim();
    if (!v || seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}

/* -------------------------
   Zod schema
------------------------- */
const imageSchema = z.string().min(1).refine(isLikelyImageSrc);
const optionalImageSchema = z.string().optional().default("");

const highlightSchema = z.object({
  title: z.string().optional().default(""),
  image: optionalImageSchema,
  caption: z.string().optional().default(""),
});

const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  rationale: z.string().min(1).max(1200),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string()).default([]),
  images: z.array(imageSchema).optional().default([]),
  highlights: z.array(highlightSchema).default([]),
});

/* -------------------------
   Utilities
------------------------- */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* -------------------------
   Screenshot kind hook
------------------------- */
function useScreenshotKind(src) {
  const [kind, setKind] = useState("web");

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () =>
      setKind(img.naturalHeight / img.naturalWidth > 1.15 ? "mobile" : "web");
    img.src = src;
  }, [src]);

  return kind;
}

/* -------------------------
   Highlight Frame (NOT default)
------------------------- */
function HighlightFrame({ src, title, linkText }) {
  const kind = useScreenshotKind(src);
  if (!src) return null;

  if (kind === "mobile") {
    return (
      <div className="mx-auto mt-2 max-w-[520px]">
        <div className="relative aspect-[9/19] rounded-[2rem] border border-neutral-700">
          <img
            src={src}
            alt={title}
            className="absolute inset-0 h-full w-full object-contain bg-neutral-950"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-neutral-800">
      <div className="flex gap-2 border-b px-3 py-2 text-[10px] text-neutral-400">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="ml-2 truncate">{linkText}</span>
      </div>

      <div className="relative aspect-video">
        <img
          src={src}
          alt={title}
          className="absolute inset-0 h-full w-full object-contain bg-neutral-950"
        />
      </div>
    </div>
  );
}

/* =========================
   DEFAULT EXPORT
========================= */
export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [draftKeyword, setDraftKeyword] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
  });

  const highlights = form.watch("highlights") || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          setSaving(true);
          await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            body: JSON.stringify(values),
          });
          router.push(`/projects/${project.id}`);
        })}
        className="space-y-6"
      >
        {/* Highlights */}
        {highlights.map((h, idx) => (
          <div key={idx} className="rounded-xl border p-3">
            <HighlightFrame
              src={h.image}
              title={h.title}
              linkText={project.link}
            />
          </div>
        ))}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
