import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = await res.json();

  const project = projects.find((p) => createSlug(p.title) === slug);

  if (!project) {
    // Keep it blunt; no over-engineering
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Not found</h2>
        <p>Project doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <Image
        src={project.image}
        alt={project.title}
        width={800}
        height={450}
        className="w-full h-64 object-cover rounded-md"
      />
      <p>{project.description}</p>
      <div className="flex gap-2 flex-wrap">
        {project.keywords?.map((k) => (
          <Badge key={k} variant="outline">
            {k}
          </Badge>
        ))}
      </div>
      <Button asChild>
        <a href={project.link} target="_blank" rel="noreferrer">
          Open Project
        </a>
      </Button>
    </div>
  );
}
