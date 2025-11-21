"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ProjectsNotFound() {
  const params = useParams();
  const slug = params?.slug;

  const message = slug
    ? `We couldn’t find any project called “${slug}”.`
    : "We couldn’t find this project.";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Project not found
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-2">
          <Button asChild>
            <Link href="/projects">Back to projects</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
