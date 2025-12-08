export const dynamic = "force-dynamic";

import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-card";
import GitHubCalendar from "@/components/github-calender";

const hero = {
  avatar: "/me.svg",
  fullName: "Shabnam Beiraghian",
  shortDescription:
    "BCIT Full-Stack Web Development student building real-world Next.js apps.",
  longDescription:
    "I’m transitioning from fast-paced, customer-facing work into software development. I enjoy building practical web apps with Next.js, React, Tailwind, and Auth0, focusing on clean UI and simple, reliable flows.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen mb-0 bg-neutral-950 text-neutral-50">
      {/* GLOW BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6 md:pt-12">
        {/* TOP ROW: HERO + STACK SIDE BY SIDE */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          {/* HERO CARD (LEFT) */}
          <div className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-[0_0_24px_rgba(59,130,246,0.35)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.7)]">
            {/* subtle top bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/70 via-cyan-400/60 to-transparent opacity-80" />
            <MyHero hero={hero} />
          </div>

          {/* STACK CARD (RIGHT) */}
          <div className="group rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(192,132,252,0.7)]">
            {/* subtle top bar */}
            <div className="mb-3 h-[2px] w-full bg-gradient-to-r from-purple-500/80 via-pink-500/70 to-transparent opacity-90" />

            {/* Top label */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
              <span className="font-mono uppercase tracking-[0.18em]">
                CurleyCoder · BCIT · 2025
              </span>
              <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-100">
                Full-Stack · Web · Mobile
              </span>
            </div>

            <div className="space-y-3 text-[11px] text-neutral-300">
              {/* TECHNOLOGY */}
              <div className="flex flex-wrap gap-2">
                <span className="mr-2 shrink-0 font-mono uppercase tracking-[0.18em] text-neutral-500">
                  Tech
                </span>

                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  JavaScript
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  TypeScript
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  HTML &amp; EJS
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  CSS &amp; Tailwind
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  React
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  React Native · Expo
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Next.js · App Router
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Auth0
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  REST APIs
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Neon · PostgreSQL · Drizzle
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Node.js
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Git &amp; GitHub
                </span>
              </div>

              {/* TOOLS */}
              <div className="flex flex-wrap gap-2">
                <span className="mr-2 shrink-0 font-mono uppercase tracking-[0.18em] text-neutral-500">
                  Tools
                </span>

                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  VS Code
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  GitHub Desktop
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Terminal · zsh
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Postman
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Figma
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Chrome DevTools
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  macOS · Linux
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Xcode
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Expo Go
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Notion
                </span>
                <span className="rounded-full border border-neutral-700/80 bg-neutral-900/80 px-3 py-1 font-mono">
                  Jira
                </span>
              </div>

              
            </div>
          </div>
        </section>

        {/* PROJECT PREVIEW */}
        <div>
          <ProjectPreviewCard count={3}/>
        </div>

        {/* GITHUB CALENDAR */}
        <div>
          <GitHubCalendar />
        </div>
      </div>
    </main>
  );
}
