"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      router.push("/auth/login");
    }
  }, [error, router]);

  return (
    <div className="flex flex-col min-h-screen items-center bg-neutral-950">
      <h1 className="mt-8 text-4xl font-bold">Dashboard</h1>

      {isLoading && <p className="mt-4">Loading...</p>}

      {!isLoading && !user && !error && (
        <p className="mt-4 text-lg">
          Log in to update your portfolio content.
        </p>
      )}

      {user && (
        <div className="mt-6 w-full max-w-5xl px-4 pb-10">
          <p className="mb-4 text-lg">
            Welcome to your dashboard, {user.nickname || user.name}!
          </p>

          <Link href="/dashboard/hero">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Edit hero section
            </button>
          </Link>
          <div className="p-3"/>
                    <Link href="/dashboard/analytics">
        <button className="rounded-md bg-neutral-800 px-4 py-2 text-sm border border-blue-500/80 font-medium text-neutral-100 hover:bg-neutral-700">
          View analytics
        </button>
      </Link>

        </div>
        
      )}
    </div>
  );
}
