"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id, size = "sm", className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(text || "Failed to delete project");
        return;
      }

      router.push("/projects");
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size={size}
      className={`rounded-xl ${className}`}
      onClick={handleDelete}
      disabled={loading}
    >
      {loading
        ? "Deleting…"
        : confirming
        ? "Click again to confirm"
        : "Delete"}
    </Button>
  );
}