import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 sm:py-14">
      {/* CTA band */}
      <div
        className="
          relative overflow-hidden rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          p-6 sm:p-8
        "
      >
        {/* micro accent line */}
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

        {/* subtle sheen */}
        <div>
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.05] to-transparent" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Let’s build something real
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Have a project idea or need a developer?
            </h3>

            <p className="max-w-xl text-sm text-muted-foreground">
              I’m open to internships, part-time roles, and small product builds.
              Send a short brief and I’ll reply with next steps.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="
                rounded-xl bg-primary text-primary-foreground
                hover:opacity-90 border border-border no-underline
              "
            >
              <Link href="/calendar">Book a Call</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="
                rounded-xl border-border bg-transparent text-foreground
                hover:bg-accent/60 no-underline
              "
            >
              <Link href="/projects">See projects</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-8 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © {year} Shabnam Beiraghian. Built with Next.js + Tailwind.
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link className="hover:text-foreground no-underline" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-foreground no-underline" href="/resume">
            Resume
          </Link>
          <Link className="hover:text-foreground no-underline" href="/contact">
            Contact
          </Link>
          <a
            className="hover:text-foreground no-underline"
            href="https://github.com/curleycoder"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="hover:text-foreground no-underline"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}