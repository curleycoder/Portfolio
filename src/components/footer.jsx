import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 bg-neutral-950/60">
      <div className="">
        {/* CTA band */}
        <div className="relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
          {/* micro accent line */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/30" />
              {/* <div className="pointer-events-none absolute left-6 top-0 h-0.5 w-36 bg-purple-400/30" /> */}

          {/* subtle sheen on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                Let’s build something real
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-100">
                Have a project idea or need a developer?
              </h3>
              <p className="max-w-xl text-sm text-neutral-400">
                I’m open to internships, part-time roles, and small product builds.
                Send a short brief and I’ll reply with next steps.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="bg-purple-500/40 text-neutral-200 hover:bg-purple-500/22">
                <Link href="/calendar">Book a Call</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-neutral-800 bg-transparent text-neutral-200 hover:bg-purple-500/20"
              >
                <Link href="/projects">See projects</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 px-5 pb-7 flex flex-col gap-4 border-t border-neutral-900/80 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {year} Shabnam Beiraghian. Built with Next.js + Tailwind.
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
            <Link className="hover:text-neutral-200" href="/projects">
              Projects
            </Link>
            <Link className="hover:text-neutral-200" href="/resume">
              Resume
            </Link>
            <Link className="hover:text-neutral-200" href="/contact">
              Contact
            </Link>
            <a
              className="hover:text-neutral-200"
              href="https://github.com/curleycoder"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="hover:text-neutral-200"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
