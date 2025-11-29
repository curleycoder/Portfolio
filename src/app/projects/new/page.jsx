"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const newProjectSchema = z.object({
  title: z.string().min(2, { message: "Your title is too short" }).max(200),
  description: z.string().min(5).max(500),
  image: imageSchema,
  link: z.string().url(),
  keywords: z.array(z.string().min(1)).max(10).optional().default([]),
});

export default function NewProjectPage() {
  const [draftKeyword, setDraftKeyword] = useState("");

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "Write your project title here...",
      description: "Write your project description here...",
      image: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
  });

  function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("link", values.link);
    (values.keywords || []).forEach((k) => formData.append("keywords", k));

    fetch("/api/projects/new", {
      method: "POST",
      body: formData,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed");
        const data = await r.json();
        // keep it minimal for the lab
        alert("Created (check server logs).");
        console.log("Server response:", data);
      })
      .catch((e) => {
        alert("Submit failed");
        console.error(e);
      });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="A title of your project" {...field} />
                </FormControl>
                <FormDescription>This is the title of your project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="A brief description of your project" {...field} />
                </FormControl>
                <FormDescription>This is a brief description of your project.</FormDescription>
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
                  <Input placeholder="https://your-image-link.com/image.png" {...field} />
                </FormControl>
                <FormDescription>Image URL of your project.</FormDescription>
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
              const handleRemove = (k) => {
                field.onChange(current.filter((x) => x !== k));
              };
              const handleKeyDown = (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              };

              return (
                <FormItem className="flex gap-4">
                  <div className="flex-1">
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          value={draftKeyword}
                          onChange={(e) => setDraftKeyword(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Add a keyword and press Enter"
                        />
                        <Button type="button" onClick={handleAdd}>
                          Add
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Tag your project for filtering later.</FormDescription>
                    <FormMessage />
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2 pt-6">
                    {current.map((k) => (
                      <Badge key={k} variant="outline" className="flex items-center gap-1">
                        {k}
                        <button type="button" className="ml-1 text-xs" onClick={() => handleRemove(k)} aria-label={`Remove ${k}`}>
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
