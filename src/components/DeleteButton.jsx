"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id, size = "sm", className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        alert(text || "Failed to delete project");
        return;
      }

      router.push("/projects");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size={size}
      className={className}
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting…" : "Delete"}
    </Button>
  );
}
