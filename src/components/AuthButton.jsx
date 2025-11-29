// src/components/AuthButton.jsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

export default function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <NavigationMenuLink asChild>
        <span>Loading...</span>
      </NavigationMenuLink>
    );
  }

  // Not logged in → show LOGIN
  if (!user) {
    return (
      <NavigationMenuLink asChild>
        <Link href="/api/auth/login?returnTo=/dashboard">Login</Link>
      </NavigationMenuLink>
    );
  }

  // Logged in → show LOGOUT
  return (
    <NavigationMenuLink asChild>
      <Link href="/api/auth/logout?returnTo=/">Logout</Link>
    </NavigationMenuLink>
  );
}
