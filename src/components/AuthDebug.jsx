"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function AuthDebug() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <p>Loading user…</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!user) return <p>Not logged in</p>;

  return <p>Logged in as: {user.email}</p>;
}
