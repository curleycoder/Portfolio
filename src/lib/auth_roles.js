const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

export function isAdmin(user) {
  if (!user?.email) return false;
  return adminEmails.includes(user.email.toLowerCase());
}
