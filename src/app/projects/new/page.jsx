import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import RevealIn from "@/components/motions/RevealIn";
import { auth0 } from "@/lib/auth0";

const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

function isAdmin(user) {
  return !!user?.email && adminEmails.includes(user.email.toLowerCase());
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function NewProjectGatePage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user || !isAdmin(user)) {
    // either: notFound() OR show message. Message is nicer in dev.
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 md:px-6">
          <RevealIn>
            <Link href="/projects" className="text-xs font-mono text-neutral-400 hover:text-neutral-100">
              ← back to projects
            </Link>
          </RevealIn>

          <RevealIn delay={0.05}>
            <Card className="rounded-2xl border border-neutral-800/90 bg-neutral-950/60 p-6">
              <p className="text-sm text-neutral-200">Forbidden.</p>
            </Card>
          </RevealIn>
        </div>
      </main>
    );
  }

  const NewProjectClient = (await import("./NewProjectClient")).default;
  return <NewProjectClient />;
}
