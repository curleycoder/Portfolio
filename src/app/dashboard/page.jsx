import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";

const ADMIN_EMAILS = ["shabnambeiraghian@gmail.com"];

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  // Not logged in → go to hidden login page (or auth login)
  if (!user) redirect("/api/auth/login?returnTo=/dashboard");

  // Logged in but not you → kick out (or 404)
  if (!ADMIN_EMAILS.includes(user.email)) redirect("/");

  return (
    <div className="flex flex-col min-h-screen items-center bg-neutral-950 text-neutral-100">
      <h1 className="mt-8 text-4xl font-bold">Dashboard</h1>

      <div className="mt-6 w-full max-w-5xl px-4 pb-10">
        <p className="mb-4 text-lg">
          Welcome to your dashboard, {user.nickname || user.name}!
        </p>

        <Link
          href="/dashboard/hero"
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Edit hero section
        </Link>

        <div className="p-3" />

        <Link
          href="/dashboard/analytics"
          className="inline-flex rounded-md bg-neutral-800 px-4 py-2 text-sm border border-blue-500/80 font-medium text-neutral-100 hover:bg-neutral-700"
        >
          View analytics
        </Link>
      </div>
    </div>
  );
}
