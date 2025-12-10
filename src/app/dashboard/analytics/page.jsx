import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getRouteViewCounts } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  const stats = await getRouteViewCounts();
  const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
  const maxViews = stats.reduce((max, s) => Math.max(max, s.views), 0) || 1;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Portfolio Analytics
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Basic route view statistics for your portfolio. Only visible to you.
          </p>
        </div>

        <Card className="border border-neutral-800 bg-neutral-900/70 p-5 space-y-5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total views</span>
            <span className="text-neutral-100 text-base font-semibold">
              {totalViews}
            </span>
          </div>

          <div className="space-y-3">
            {stats.length === 0 && (
              <p className="text-xs text-neutral-500">
                No data yet. Browse your site to start collecting views.
              </p>
            )}

            {stats.map((row) => (
              <div key={row.path} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="max-w-[70%] truncate text-neutral-100">
                    {row.path}
                  </span>
                  <span className="text-neutral-400">{row.views}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-blue-500/80"
                    style={{ width: `${(row.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
