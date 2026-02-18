"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const baseNavItem =
  "inline-flex items-center rounded-md px-3 py-2 text-sm text-neutral-200 transition-colors " +
  "hover:bg-white/10 hover:text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);


export default function AuthButton({ className = "" }) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;

  const email = user?.email;
  if (!email) return null;

  if (!ADMIN_EMAILS.includes(email)) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link href="/dashboard" className={baseNavItem}>
        Dashboard
      </Link>
      <a href="/api/auth/logout?returnTo=/" className={baseNavItem}>
        Logout
      </a>
    </div>
  );
}
