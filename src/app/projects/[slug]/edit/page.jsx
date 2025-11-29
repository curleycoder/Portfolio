import { createSlug } from "@/lib/utils";
import EditProjectForm from "@/components/EditForm";
import { auth0 } from "@/lib/auth0";

export default async function EditProjectPage({ params }) {
  const { slug } = params;

  // 🔒 server-side guard: redirect or error if not logged in
  const session = await auth0.getSession();
  if (!session?.user) {
    // you can also redirect("/api/auth/login?returnTo=/projects/...") if you want
    return (
      <div className="p-6">
        <p>You must be logged in to edit projects.</p>
      </div>
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = await res.json();

  const project = projects.find((p) => createSlug(p.title) === slug);

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <EditProjectForm project={project} />
    </div>
  );
}
