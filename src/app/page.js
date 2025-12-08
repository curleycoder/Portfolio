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
      {/* GAMEY GLOW BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6 md:pt-12">
        {/* SMALL STATUS BAR */}
        <div className="mb-2 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="uppercase tracking-[0.2em]">
            CurleyCoder · BCIT · 2025
          </span>
          <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
            Next.js
          </span>
          <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
App Router
          </span>
          <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
            Auth0
          </span>
          <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
REST APIs
          </span>
        </div>

        {/* HERO (WRAPS MyHero) */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-xl shadow-blue-500/20">
          <MyHero hero={hero} />
        </div>

        {/* PROJECT PREVIEW */}
        <div>
          <ProjectPreviewCard count={3} />
        </div>

        {/* GITHUB CALENDAR */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-xl shadow-cyan-500/12">
          <GitHubCalendar />
        </div>
      </div>
    </main>
  );
}
