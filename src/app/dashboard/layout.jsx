import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";

const ADMIN_EMAILS = ["shabnambeiraghian@gmail.com"].map((e) => e.toLowerCase());

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  const user = session?.user;

  if (!user) redirect("/api/auth/login?returnTo=/dashboard");

  const email = (user.email || "").toLowerCase();
  if (!ADMIN_EMAILS.includes(email)) redirect("/");

  return <>{children}</>;
}
