// app/projects/new/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Card } from "@/components/ui/card";
import RevealIn from "@/components/motions/RevealIn";
import { auth0 } from "@/lib/auth0";
import NewProjectForm from "@/components/NewProjectForm";

/**
 * IMPORTANT:
 * - This is SERVER code, so use a server env var (no NEXT_PUBLIC_ needed).
 * - Make sure this matches what you use elsewhere.
 *   Recommended: ADMIN_EMAILS="a@b.com,c@d.com"
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdmin(user) {
  const email = user?.email ? String(user.email).toLowerCase() : "";
  return !!email && ADMIN_EMAILS.includes(email);
}

// Avoid caching for admin-gated page
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function NewProjectGatePage() {
  noStore();

  const session = await auth0.getSession();
  const user = session?.user;

  // Not logged in => 404 (your middleware/layout can redirect if you want)
  if (!user) notFound();

  // Not admin => 404 (keeps the route hidden)
  if (!isAdmin(user)) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 md:px-6">
        <RevealIn>
          <Link
            href="/projects"
            className="text-xs font-mono text-neutral-400 hover:text-neutral-100 no-underline"
          >
            ← back to projects
          </Link>
        </RevealIn>

        <RevealIn delay={0.05}>
          <Card className="rounded-2xl border border-neutral-800/90 bg-neutral-950/60 p-6">
            <NewProjectForm />
          </Card>
        </RevealIn>
      </div>
    </main>
  );
}