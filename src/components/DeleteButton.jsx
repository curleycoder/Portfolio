"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id, size = "sm", className = "" }) {
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete project");
      return;
    }

    router.push("/projects");
    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      size={size}
      className={className}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}
