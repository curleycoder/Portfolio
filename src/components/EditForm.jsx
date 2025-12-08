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

// allow URL OR data:image/... from file upload
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
        "Must be a URL (https://...) or an uploaded image (data:image/...).",
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

export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [draftKeyword, setDraftKeyword] = useState("");
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(project.image || null);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      keywords: project.keywords ?? [],
      images: project.images ?? [],
    },
  });

  // helper: file -> data URL
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setFileError("");

    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));

      // first upload = main image
      form.setValue("image", dataUrls[0], { shouldValidate: true });
      setPreview(dataUrls[0]);

      // rest = extras (replace existing extras, not append − simpler UX)
      const extras = dataUrls.slice(1);
      const currentExtras = form.getValues("images") || [];
      form.setValue(
        "images",
        extras.length ? extras : currentExtras,
        { shouldValidate: true }
      );
    } catch (err) {
      console.error(err);
      setFileError("Failed to read files. Try smaller images or fewer files.");
    }
  }

  const onSubmit = async (values) => {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        image: values.image,
        link: values.link,
        keywords: values.keywords,
        images: values.images,
      }),
    });

    if (!res.ok) {
      alert("Failed to update project");
      console.error("Update error:", await res.text());
      return;
    }

    // we are using /projects/:id routes now
    router.push(`/projects/${project.id}`);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="My awesome project" {...field} />
              </FormControl>
              <FormDescription>
                This is shown on cards and the details page.
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
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief summary of your project"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGE URL / DATA URL */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL or uploaded image</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-image-url.png"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can paste a URL, or upload images below – the first upload
                becomes the main image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FILE UPLOADS FROM DESKTOP */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <div className="space-y-2 no-border">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/80 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-400"
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
                        alt="Preview"
                        className="h-24 w-auto rounded-md border border-neutral-700 object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                First file = main image, others will show in the slideshow on
                the details page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LINK */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-project-link.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Deployed site, GitHub repo, or demo.</FormDescription>
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
                <FormLabel>Keywords</FormLabel>
                <FormDescription>
                  Add technologies or tags (e.g. nextjs, react-native, mobile).
                </FormDescription>

                <div className="mt-1 flex gap-2">
                  <Input
                    placeholder="e.g. react, nextjs"
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
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemove(value)}
                    >
                      {value} ×
                    </Badge>
                  ))}
                </div>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="mt-2 border border-blue-500/80">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
