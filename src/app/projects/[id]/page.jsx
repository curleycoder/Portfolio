import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { Button } from "@/components/ui/button";
import DeleteProjectButton from "@/components/DeleteButton";
import { getProjectById } from "@/lib/db";
import { ProjectMediaFrame } from "@/components/ProjectMediaFrame";

export default async function ProjectDetailsPage({ params }) {
  const { id } = params; // 👈 comes from /projects/:id

  const project = await getProjectById(id);

  if (!project) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-6">
            <h1 className="mb-2 text-2xl font-semibold text-red-50">
              Project not found
            </h1>
            <p className="mb-4 text-sm text-red-100/80">
              We couldn’t find a project matching this URL.
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

  const session = await auth0.getSession();
  const canEdit = !!session?.user;

  const keywords = (project.keywords || []).map((k) =>
    String(k).toLowerCase()
  );
  const isMobile =
    keywords.includes("react-native") ||
    keywords.includes("expo") ||
    keywords.includes("mobile");

  const images = [];
  if (project.image) images.push(project.image);
  if (Array.isArray(project.images)) images.push(...project.images);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
        {/* top bar */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-50">
              {project.title}
            </h1>
            <p className="mt-2 text-xs text-neutral-400">
              This is how it appears across your portfolio.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            ← Back to projects
          </Link>
        </div>

        {/* main card */}
        <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
          {/* DEVICE / BROWSER FRAME + SLIDER */}
          <ProjectMediaFrame
            title={project.title}
            images={images}
            isMobile={isMobile}
            link={project.link}
          />

          {/* description + keywords */}
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed text-neutral-200">
              {project.description}
            </p>

            {project.keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {project.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="text-sm border border-blue-500/80">
              <a href={project.link} target="_blank" rel="noreferrer">
                Visit project
              </a>
            </Button>

            {canEdit && (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="text-sm text-black"
                >
                  <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                </Button>
                <DeleteProjectButton id={project.id} />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
