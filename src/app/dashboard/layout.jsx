import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login?returnTo=/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {children}
    </div>
  );
}
