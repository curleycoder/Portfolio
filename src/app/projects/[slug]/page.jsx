import Image from "next/image";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { createSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteProjectButton from "@/components/DeleteButton";
// import { isAdmin } from "@/lib/auth-roles";


export default async function ProjectDetailsPage({ params }) {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = await res.json();

  // 🔹 pick the matching project
  const project =
    projects.find((p) => createSlug(p.title) === slug) ??
    projects.find((p) => p.id?.toString() === slug);

  // now you can safely check it
  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link href="/projects" className="text-blue-600 underline mt-4 block">
          Back to projects
        </Link>
      </div>
    );
  }


const session = await auth0.getSession();
const canEdit = !!session?.user; // anyone logged-in can edit


  return (
    <section className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{project.title}</h1>

      <Image
        src={project.image}
        alt={project.title}
        width={800}
        height={450}
        className="w-full h-64 object-cover rounded-md"
      />

      <p className="text-lg mt-4">{project.description}</p>

      <div className="flex gap-2 flex-wrap mt-3">
        {project.keywords?.map((k) => (
          <span
            key={k}
            className="px-2 py-1 bg-gray-200 rounded-full text-xs uppercase tracking-wide"
          >
            {k}
          </span>
        ))}
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-5 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Visit Project
      </a>

      {canEdit && (
  <div className="mt-6 flex gap-3">
    <Button asChild variant="outline">
      <Link href={`/projects/${slug}/edit`}>Edit</Link>
    </Button>
    <DeleteProjectButton id={project.id} />
  </div>
)}

      <div className="mt-4">
        <Link href="/projects" className="text-sm text-blue-600 underline">
          ← Back to projects
        </Link>
      </div>
    </section>
  );
}
