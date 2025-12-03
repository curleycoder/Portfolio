import { createSlug } from "@/lib/utils";
import EditProjectForm from "@/components/EditForm";
import { auth0 } from "@/lib/auth0";

import {
  ensureProjectsTable,
  seedProjectsTable,
  fetchProjects,
} from "@/lib/db";
import { PROJECT_SEED } from "@/lib/project-seed";

const LIMIT = 200;

export default async function EditProjectPage({ params }) {
  const { slug } = params;

  // 🔒 server-side guard
  const session = await auth0.getSession();
  if (!session?.user) {
    return (
      <div className="p-6">
        <p>You must be logged in to edit projects.</p>
      </div>
    );
  }

  await ensureProjectsTable();
  await seedProjectsTable(PROJECT_SEED);

  const projects = await fetchProjects({ limit: LIMIT, offset: 0 });

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
