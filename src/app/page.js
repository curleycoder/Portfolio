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

const skillLevelClass = {
  beginner:
    "border-sky-500/40 bg-sky-500/10 text-emerald-200",
  intermediate:
    "border-blue-500/50 bg-blue-500/10 text-sky-200",
  expert:
    "border-emerald-500/60 bg-emerald-500/10 text-pink-200",
};

const skills = {
  frontend: [
    { name: "HTML / CSS", level: "expert" },
    { name: "Tailwind CSS", level: "expert" },
    { name: "React", level: "expert" },
    { name: "Next.js (App Router)", level: "intermediate" },
  ],
  backend: [
    { name: "Node.js", level: "intermediate" },
    { name: "REST APIs", level: "intermediate" },
    { name: "Neon · PostgreSQL", level: "intermediate" },
    { name: "Drizzle ORM", level: "beginner" },
  ],
  mobile: [
    { name: "React Native", level: "intermediate" },
    { name: "Expo", level: "intermediate" },
    { name: "Expo Go / Xcode", level: "intermediate" },
  ],
  tools: [
    { name: "Git & GitHub", level: "expert" },
    { name: "VS Code", level: "expert" },
    { name: "Chrome DevTools", level: "intermediate" },
    { name: "Auth0", level: "beginner" },
    { name: "Postman", level: "intermediate" },
    { name: "Jira / Notion", level: "expert" },
  ],
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
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
          {/* HERO CARD (LEFT) */}
          <div className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-[0_0_24px_rgba(59,130,246,0.35)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.7)]">
            {/* subtle top bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/70 via-cyan-400/60 to-transparent opacity-80" />
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
              <span className="m-4 pt-3 px-3 font-mono uppercase tracking-[0.18em]">
                CurleyCoder · BCIT · 2025
              </span>
            <MyHero hero={hero} />
            </div>
          </div>

          {/* STACK CARD (RIGHT) – REAL VISUALIZER NOW */}
          <div className="group rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(192,132,252,0.7)]">
            {/* subtle top bar */}
            <div className="mb-3 h-[2px] w-full bg-gradient-to-r from-purple-500/80 via-pink-500/70 to-transparent opacity-90" />

            {/* Top label */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
              <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-100">
                Full-Stack · Web · Mobile
              </span>
            </div>

            {/* LEVEL LEGEND */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-neutral-400">
              <span className="mr-2 font-mono uppercase tracking-[0.18em] text-neutral-500">
                Levels
              </span>
              <span className={`rounded-full px-2 py-0.5 ${skillLevelClass.beginner}`}>
                Beginner
              </span>
              <span className={`rounded-full px-2 py-0.5 ${skillLevelClass.intermediate}`}>
                Intermediate
              </span>
              <span className={`rounded-full px-2 py-0.5 ${skillLevelClass.expert}`}>
                Expert
              </span>
            </div>

            {/* CATEGORIES */}
            <div className="space-y-4 text-[11px] text-neutral-300">
              {/* FRONTEND */}
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono uppercase tracking-[0.18em] text-neutral-500">
                    Frontend
                  </span>
                  <span className="h-px flex-1 bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <span
                      key={skill.name}
                      className={[
                        "rounded-full px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
                        skillLevelClass[skill.level],
                      ].join(" ")}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* BACKEND */}
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono uppercase tracking-[0.18em] text-neutral-500">
                    Backend
                  </span>
                  <span className="h-px flex-1 bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <span
                      key={skill.name}
                      className={[
                        "rounded-full px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
                        skillLevelClass[skill.level],
                      ].join(" ")}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* MOBILE */}
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono uppercase tracking-[0.18em] text-neutral-500">
                    Mobile
                  </span>
                  <span className="h-px flex-1 bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.mobile.map((skill) => (
                    <span
                      key={skill.name}
                      className={[
                        "rounded-full px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
                        skillLevelClass[skill.level],
                      ].join(" ")}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* DEVOPS / TOOLS */}
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono uppercase tracking-[0.18em] text-neutral-500">
                    DevOps &amp; Tools
                  </span>
                  <span className="h-px flex-1 bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <span
                      key={skill.name}
                      className={[
                        "rounded-full px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
                        skillLevelClass[skill.level],
                      ].join(" ")}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT PREVIEW */}
        <div>
          <ProjectPreviewCard count={3} />
        </div>

        {/* GITHUB CALENDAR */}
        <div>
          <GitHubCalendar />
        </div>
      </div>
    </main>
  );
}
