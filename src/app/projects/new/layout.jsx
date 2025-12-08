import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function NewProjectLayout({ children }) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/api/auth/login?returnTo=/projects/new");
  }

  return <>{children}</>;
}
