import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound({ message }) {
  const displayMessage =
    message ?? "The page you are looking for doesn’t exist or might have been moved.";

  return (
    <div className="py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <div
          className="
            relative overflow-hidden rounded-2xl border border-border
            bg-card/70 text-card-foreground backdrop-blur
            shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
            p-6 sm:p-8
          "
        >
          {/* micro accent line */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

          <div className="space-y-3 text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              404
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em]">
              Page not found
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground">
              {displayMessage}
            </p>

            <div className="pt-3 flex justify-center">
              <Button
                asChild
                className="
                  rounded-xl bg-primary text-primary-foreground
                  hover:opacity-90 border border-border no-underline
                "
              >
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}