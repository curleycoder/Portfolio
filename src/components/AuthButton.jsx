"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

const baseNavItem =
  "inline-flex items-center rounded-md px-3 py-2 text-sm text-neutral-200 transition-colors " +
  "hover:bg-white/10 hover:text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60";

const ADMIN_EMAILS = ["shabnambeiraghian@gmail.com"]; // add more if needed

export default function AuthButton({ className = "" }) {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  // Not logged in: hide completely (public users won't see anything)
  if (!user) return null;

  // Logged in but not admin: hide completely
  if (!isAdmin) return null;

  // Admin logged in: show logout (or dashboard link + logout)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href="/dashboard" className={baseNavItem}>
        Dashboard
      </a>
      <a href="/api/auth/logout?returnTo=/" className={baseNavItem}>
        Logout
      </a>
    </div>
  );
}
