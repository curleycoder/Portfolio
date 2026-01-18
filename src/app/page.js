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

/* ONE COLOR PER CATEGORY — NO LEVELS */
const categoryClass = {
  frontend: "border-cyan-500/50 bg-cyan-500/10 text-cyan-100",
  backend: "border-blue-500/50 bg-blue-500/10 text-blue-100",
  mobile: "border-purple-500/50 bg-purple-500/10 text-purple-100",
  tools: "border-pink-300/50 bg-pink-500/10 text-pink-100",
};

const skills = {
  frontend: ["HTML / CSS", "Tailwind CSS", "React", "Next.js (App Router)"],
  backend: ["Node.js", "REST APIs", "Neon · PostgreSQL", "Drizzle ORM"],
  mobile: ["React Native", "Expo", "Expo Go / Xcode"],
  tools: [
    "Git & GitHub",
    "VS Code",
    "Chrome DevTools",
    "Auth0",
    "Postman",
    "Jira / Notion",
  ],
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-50">
      {/* GLOW BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6 md:pt-12">
        {/* HERO + STACK */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
          {/* HERO */}
          <div className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300">
            <div className="h-0.5 w-full bg-linear-to-r from-blue-pink/70 via-purple-400/60 to-transparent opacity-80" />
            <span className="m-4 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
              CurleyCoder · BCIT · 2025
            </span>
            <MyHero hero={hero} />
          </div>

          {/* STACK */}
          <div className="group rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300">
            <div className="mb-3 h-0.5 w-full bg-linear-to-r from-purple-500/80 via-pink-500/70 to-transparent opacity-90" />

            <div className="mb-4">
              <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-100">
                Full-Stack · Web · Mobile
              </span>
            </div>

            {/* SKILL CATEGORIES */}
            <div className="space-y-4 text-[11px] text-neutral-300">
              {/* FRONTEND */}
              <SkillGroup
                title="Frontend"
                items={skills.frontend}
                color={categoryClass.frontend}
              />

              {/* BACKEND */}
              <SkillGroup
                title="Backend"
                items={skills.backend}
                color={categoryClass.backend}
              />

              {/* MOBILE */}
              <SkillGroup
                title="Mobile"
                items={skills.mobile}
                color={categoryClass.mobile}
              />

              {/* TOOLS */}
              <SkillGroup
                title="DevOps & Tools"
                items={skills.tools}
                color={categoryClass.tools}
              />
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <ProjectPreviewCard count={3} />

        {/* GITHUB */}
        <GitHubCalendar />
      </div>
    </main>
  );
}

function SkillGroup({ title, items, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="font-mono uppercase tracking-[0.18em] text-neutral-500">
          {title}
        </span>
        <span className="h-px flex-1 bg-neutral-800" />
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((name) => (
          <span
            key={name}
            className={[
              "rounded-full border px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
              color,
            ].join(" ")}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
