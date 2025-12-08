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
import { createSlug } from "@/lib/utils";
const imageSchema = z
  .string()
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/"),
    {
      message:
        "Must be a full URL (https://...) or a /public path like `/forge.png`",
    }
  );


const projectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(500),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string()).default([]),
});

export default function EditProjectForm({ project }) {
  const router = useRouter();
  const [draftKeyword, setDraftKeyword] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      keywords: project.keywords ?? [],
    },
  });

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
      }),
    });

    if (!res.ok) {
      alert("Failed to update project");
      return;
    }

    const slug = createSlug(values.title);
    router.push(`/projects/${slug}`);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                This will be used to generate the project slug.
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
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input placeholder="Brief summary of your project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-image-url.png" {...field} />
              </FormControl>
              <FormDescription>
                Must be a valid URL. You can use an image from /public with
                something like `/forge.png` if Next/Image allows it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input placeholder="https://your-project-link.com" {...field} />
              </FormControl>
              <FormDescription>Link to your project.</FormDescription>
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

            const handleRemove = (value) => {
              field.onChange(current.filter((k) => k !== value));
            };

            return (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormDescription>
                  Add technologies or tags for this project.
                </FormDescription>

                <div className="flex gap-2 mt-1">
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
                  <Button className="border border-blue-500/80" type="button" onClick={handleAdd}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
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
