"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPreviewCard({ count = 3 }) {
  const projects = [
    {
      title: "Project One",
      desc: "Short blurb for project one.",
      src: "/project1.jpg",
      link: "#",
    },
    {
      title: "Project Two",
      desc: "Short blurb for project two.",
      src: "/project2.png",
      link: "#",
    },
    {
      title: "Project Three",
      desc: "Short blurb for project three.",
      src: "/project3.png",
      link: "#",
    },
    {
      title: "Project Four",
      desc: "Short blurb for project four.",
      img: "https://placehold.co/600x400/png",
      link: "#",
    },
  ].slice(0, Math.max(1, count));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {projects.map((p, idx) => (
          <Card key={idx} className="flex flex-col h-full">
            <div className="relative h-40 w-full">
              {(p.src || p.img) ? (
                <Image
                  src={p.src || p.img}
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
              <p className="mb-4">{p.desc}</p>
              <Button asChild>
                <Link href={p.link}>View Project</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
