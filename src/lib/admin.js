import { auth0 } from "@/lib/auth0";

const parseList = (s) =>
  String(s || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

export async function requireAdminOr401() {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  const allowEmails = parseList(process.env.ADMIN_EMAILS); // safest
  const allowDomain = String(process.env.ADMIN_DOMAIN || "").toLowerCase(); // optional

  const okEmail = !!email && (allowEmails.length ? allowEmails.includes(email) : false);
  const okDomain = !!email && !!allowDomain && email.endsWith(`@${allowDomain}`);

  // choose policy: allow list first, domain fallback if you want
  const isAdmin = okEmail || okDomain;

  if (!isAdmin) return { isAdmin: false, email: email || null, session: !!session };
  return { isAdmin: true, email, session: true };
}
