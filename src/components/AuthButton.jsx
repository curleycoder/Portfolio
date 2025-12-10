"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function AuthButton({ className = "" }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  if (!user) {
    return (
      <a
        href="/api/auth/login?prompt=login&returnTo=/dashboard"
        className={className}
      >
        Login
      </a>
    );
  }

  return (
    <a
      href="/api/auth/logout?returnTo=/"
      className={className}
    >
      Logout
    </a>
  );
}
