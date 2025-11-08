// REMOVE: "use client";  <-- this must go (server component)

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectPreviewCard({ count = 3 }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = await res.json();

  const items = (projects ?? []).slice(0, Math.max(1, count));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {items.map((p, idx) => (
          <Card key={idx} className="flex flex-col h-full">
            <div className="relative h-40 w-full">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </div>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm flex-1">
              <p className="mb-4">{p.description}</p>
              <Button asChild>
                <Link href={p.link} target="_blank" rel="noreferrer">
                  View Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
