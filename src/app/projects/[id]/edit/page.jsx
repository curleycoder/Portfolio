import Link from "next/link";
import EditProjectForm from "@/components/EditForm";
import { auth0 } from "@/lib/auth0";
import { fetchProjectById } from "@/lib/db";

export default async function EditProjectPage({ params }) {
  const { id } = params;

  // 🔒 server-side guard
  const session = await auth0.getSession();
  if (!session?.user) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-sm text-neutral-200">
            <p className="mb-3 font-medium">
              You must be logged in to edit projects.
            </p>
            <Link
              href="/projects"
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              ← Back to projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ✅ load exactly one project by id
const project = await fetchProjectById(id); 
  if (!project) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-6 text-sm text-red-100">
            <h1 className="mb-2 text-lg font-semibold">Project not found</h1>
            <p className="mb-4 text-xs text-red-200/80">
              We couldn’t find a project matching this URL. It may have been
              deleted or renamed.
            </p>
            <Link
              href="/projects"
              className="text-xs text-blue-300 hover:text-blue-200"
            >
              ← Back to projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* header row */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
              Edit project
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Update the content that powers your portfolio cards.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            ← Back to projects
          </Link>
        </div>

        {/* glass card */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
          <EditProjectForm project={project} />
        </div>
      </div>
    </main>
  );
}
