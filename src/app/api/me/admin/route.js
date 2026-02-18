import { auth0 } from "@/lib/auth0";
import { isAdmin } from "@/lib/auth_roles"; // adjust import to your file

export async function GET() {
  const session = await auth0.getSession();
  const user = session?.user;

  return Response.json({
    ok: true,
    isAdmin: !!user && isAdmin(user),
    email: user?.email ?? null,
  });
}
