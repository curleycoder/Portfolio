import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";

export default async function ProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = await res.json();

  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const slug = createSlug(p.title);
        return (
          <Card
            key={slug}
            className="p-4 group hover:scale-105 transition-transform"
          >
            <h3 className="font-semibold mb-2">{p.title}</h3>
            <Image
              src={p.image}
              alt={p.title}
              width={300}
              height={300}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {p.description}
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" variant="secondary">
                <a href={p.link} target="_blank" rel="noreferrer">
                  Open
                </a>
              </Button>
              <Button asChild size="sm">
                <Link href={`/projects/${slug}`}>Details</Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
