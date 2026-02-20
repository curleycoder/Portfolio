"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProjectsNotFound() {
  const params = useParams();
  const slug = params?.slug;

  const message = slug
    ? `We couldn’t find any project called “${slug}”.`
    : "We couldn’t find this project.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card
        className="
          relative w-full max-w-md overflow-hidden text-center
          rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
        "
      >
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

        <CardHeader className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Not found
          </div>

          <CardTitle className="font-heading text-2xl tracking-tight">
            Project not found
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center gap-2">
          <Button asChild>
            <Link href="/projects" className="no-underline">
              Back to projects
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/" className="no-underline">
              Back home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}