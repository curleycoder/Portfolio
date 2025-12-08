"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";

const heroFormSchema = z.object({
  avatar: z.string().trim().min(1, "Avatar is required"),
  fullName: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().min(2).max(120),
  longDescription: z.string().trim().min(10).max(5000),
});

export default function HeroEditorForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      avatar: "",
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  const avatar = watch("avatar");
  const fullName = watch("fullName");
  const shortDescription = watch("shortDescription");
  const longDescription = watch("longDescription");

  // Fetch current hero
  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/hero");
        if (!res.ok) throw new Error("Failed to load hero");
        const data = await res.json();

        setValue("avatar", data.avatar || "");
        setValue("fullName", data.fullName || "");
        setValue("shortDescription", data.shortDescription || "");
        setValue("longDescription", data.longDescription || "");
      } catch (err) {
        console.error(err);
        toast.error("Could not load hero data");
      } finally {
        setIsLoading(false);
      }
    }

    loadHero();
  }, [setValue]);

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result?.toString() || "";
      setValue("avatar", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save hero");
      toast.success("Hero updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not save hero");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6 text-sm text-neutral-300">
        Loading hero…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-6 shadow-xl shadow-blue-500/20"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
        Hero Section Editor
      </h2>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
        {/* LEFT: LIVE PREVIEW, MATCHES MyHeroSection STYLE */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* BIG AVATAR */}
            <div className="flex items-center justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 shadow-md md:h-40 md:w-40">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={fullName || "Hero avatar"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 7rem, 10rem"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-500">
                    No avatar
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Full-stack dev &amp; PM
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-50 md:text-2xl">
                {fullName || "Your name here"}
              </h3>
              <p className="text-sm text-neutral-200">
                {shortDescription || "Short one-line summary about what you do."}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-neutral-300">
            {longDescription ||
              "Use this space to write a 3–4 sentence introduction. Talk about your background, what you’re learning, and the kind of work you like to do."}
          </p>
        </div>

        {/* RIGHT: FORM FIELDS */}
        <div className="space-y-4 text-sm">
          {/* Avatar upload */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Avatar image
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-500">
                    No avatar
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="text-xs text-neutral-200 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-100 hover:file:bg-neutral-700"
                />
                {errors.avatar && (
                  <p className="text-xs text-red-500">
                    {errors.avatar.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full name */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Full name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-blue-500"
              placeholder="Shabnam Beiraghian"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fullName.message?.toString()}
              </p>
            )}
          </div>

          {/* Short description */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Short description
            </label>
            <input
              type="text"
              {...register("shortDescription")}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-blue-500"
              placeholder="BCIT Full-Stack Web Development student building real-world Next.js apps."
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Max 120 characters – this shows as the one-line tagline.
            </p>
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.shortDescription.message?.toString()}
              </p>
            )}
          </div>

          {/* Long description */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Long description
            </label>
            <textarea
              {...register("longDescription")}
              rows={6}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-blue-500"
              placeholder="Write 3–4 sentences about your background, what you’re transitioning from, and what you’re excited to build."
            />
            {errors.longDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.longDescription.message?.toString()}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save hero"}
          </button>
        </div>
      </div>
    </form>
  );
}
