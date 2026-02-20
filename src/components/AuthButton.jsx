"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const navButton =
  "inline-flex items-center rounded-xl px-3 py-2 text-sm " +
  "border border-border bg-card/30 text-muted-foreground " +
  "transition hover:bg-accent/60 hover:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default function AuthButton({ className = "" }) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;

  const email = user?.email?.toLowerCase();
  if (!email) return null;

  if (!ADMIN_EMAILS.includes(email)) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link href="/dashboard" className={navButton}>
        Dashboard
      </Link>

      <a href="/api/auth/logout?returnTo=/" className={navButton}>
        Logout
      </a>
    </div>
  );
}