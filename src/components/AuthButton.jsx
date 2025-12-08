// src/components/AuthButton.jsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function AuthButton({ className = "" }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  // Not logged in → LOGIN
  if (!user) {
    return (
      <Link
        href="/api/auth/login?returnTo=/dashboard"
        className={className}
      >
        Login
      </Link>
    );
  }

  // Logged in → LOGOUT
  return (
    <Link href="/api/auth/logout?returnTo=/" className={className}>
      Logout
    </Link>
  );
}
