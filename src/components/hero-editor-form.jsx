"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const heroFormSchema = z.object({
  avatar: z.string().trim().min(1),
  fullName: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().min(2).max(120),
  longDescription: z.string().trim().min(10).max(5000),
});

export default function HeroEditorForm() {
  const [avatarFile, setAvatarFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      avatar: "",
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const avatarValue = watch("avatar");

  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await fetch("/api/hero");
        if (!res.ok) throw new Error("Failed to load hero");
        const { data } = await res.json();

        if (data) {
          reset({
            avatar: data.avatar || "",
            fullName: data.fullName || "",
            shortDescription: data.shortDescription || "",
            longDescription: data.longDescription || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load hero content, using defaults.");
      }
    };

    loadHero();
  }, [reset]);

  const onAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result?.toString() || "";
      setValue("avatar", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("avatar", values.avatar);
      formData.append("fullName", values.fullName);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);
      if (avatarFile) formData.append("avatarFile", avatarFile);

      const response = await fetch("/api/hero", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Failed to update hero");
      }

      const { data } = await response.json();

      reset({
        avatar: data.avatar,
        fullName: data.fullName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      });

      toast.success("Hero section updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating hero");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-2">Hero Editor</h2>

      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-zinc-300">
            {avatarValue ? (
              <img
                src={avatarValue}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                No avatar
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="text-sm"
          />
          {errors.avatar && (
            <p className="text-xs text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        <div className="flex-1 space-y-4 min-w-[250px]">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description (max 120 chars)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800"
              {...register("shortDescription")}
            />
            {errors.shortDescription && (
              <p className="text-xs text-red-500">
                {errors.shortDescription.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Long Description
        </label>
        <textarea
          rows={6}
          className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          {...register("longDescription")}
        />
        {errors.longDescription && (
          <p className="text-xs text-red-500">
            {errors.longDescription.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save hero"}
      </button>
    </form>
  );
}
