"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/DeleteButton";

export default function AdminProjectActions({ id }) {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    fetch("/api/me/admin", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setIsAdmin(!!j?.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [user, isLoading]);

  if (isLoading) return null;
  if (!user) return null;
  if (!isAdmin) return null;

  return (
    <>
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900"
      >
        <Link href={`/projects/${id}/edit`}>Edit</Link>
      </Button>

      <DeleteButton id={id} size="sm" className="text-xs" />
    </>
  );
}
