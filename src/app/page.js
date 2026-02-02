export const dynamic = "force-dynamic";

import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-card";
import GitHubCalendar from "@/components/github-calender";

import ParticlesHero from "@/components/ParticlesHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motions/Motion";
// import Reveal from "@/components/motions/Reveal";

const hero = {
  avatar: "/ai.png",
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
  dev: "border-pink-300/50 bg-pink-500/10 text-pink-100",
  tools: "border-yellow-300/50 bg-yellow-500/10 text-yellow-100",
  del: "border-green-300/50 bg-green-500/10 text-green-100",
};

const skills = {
  frontend: [
    "HTML · CSS",
    "Tailwind CSS",
    "React",
    "Next.js · App Router",
    "Responsive UI",
    "Accessibility",
  ],
  backend: [
    "Node.js",
    "Hono",
    "REST APIs",
    "Authentication",
    "Neon · PostgreSQL",
    "MongoDB",
    "Drizzle ORM",
    "MySQL",
    "Prisma",
  ],
  mobile: ["React Native", "Expo", "Expo Go", "Xcode"],
  dev: ["CI / CD", "Vercel", "Render", "AWS (S3)", "Environment Configuration"],
  tools: [
    "Git · GitHub",
    "VS Code",
    "Chrome DevTools",
    "Postman",
    "Figma",
    "Jira · Trello · Taiga",
    "Code Reviews",
  ],
  del: [
    "Agile · Scrum",
    "Scrum Master",
    "Technical Project Management",
    "Sprint Planning",
    "Feature Delivery",
  ],
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-50 dev-grid">
      {/* GLOW BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6 md:pt-12">
        <section className="flex flex-col gap-6">
          {/* HERO */}
          <Reveal className="relative">
            <div className="relative group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300">
              {/* particles ONLY here */}
              <div className="absolute inset-0">
                <ParticlesHero />
              </div>

              <div className="relative">
                <div className="h-0.5 w-full bg-linear-to-r from-blue-pink/70 via-purple-400/60 to-transparent opacity-80" />
                {/* <span className="m-4 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                  CurleyCoder · BCIT · 2025
                </span> */}

                {/* stagger hero content inside */}
                <Stagger className="px-0" delayChildren={0.08} stagger={0.06}>
                  <StaggerItem>
                    <MyHero hero={hero} />
                  </StaggerItem>
                </Stagger>
              </div>
            </div>
          </Reveal>

          {/* STACK */}
          <Reveal delay={0.08}>
            <div className="group rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4 shadow-[0_0_24px_rgba(168,85,247,0.32)] transition-transform duration-300">
              <div className="mb-3 h-0.5 w-full bg-linear-to-r from-purple-500/80 via-pink-500/70 to-transparent opacity-90" />

              <div className="mb-4">
                <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-100">
                  Full-Stack · Web · Mobile
                </span>
              </div>

              {/* SKILL CATEGORIES */}
              <div className="space-y-4 text-[11px] text-neutral-300">
                <SkillGroup
                  title="Frontend"
                  items={skills.frontend}
                  color={categoryClass.frontend}
                />
                <SkillGroup
                  title="Backend & Databses"
                  items={skills.backend}
                  color={categoryClass.backend}
                />
                <SkillGroup
                  title="Mobile"
                  items={skills.mobile}
                  color={categoryClass.mobile}
                />
                <SkillGroup
                  title="DevOps & Deployment"
                  items={skills.dev}
                  color={categoryClass.dev}
                />
                <SkillGroup
                  title="Tools & Workflow"
                  items={skills.tools}
                  color={categoryClass.tools}
                />
                <SkillGroup
                  title="Leadership & Delivery"
                  items={skills.del}
                  color={categoryClass.del}
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* PROJECTS */}
        <Reveal delay={0.05}>
          {/* <section> */}
          {/* If ProjectPreviewCard renders cards internally, you’ll get motion there too
               once you wrap its internal list items with Stagger/StaggerItem (recommended). */}
          <ProjectPreviewCard count={3} />
          {/* </section> */}
        </Reveal>

        {/* GITHUB */}
        <Reveal delay={0.08}>
          {/* <section> */}
          <GitHubCalendar />
          {/* </section> */}
        </Reveal>
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

      {/* Proper stagger for chips */}
      <Stagger
        className="flex flex-wrap gap-2"
        delayChildren={0.04}
        stagger={0.04}
      >
        {items.map((name) => (
          <StaggerItem key={name}>
            <span
              className={[
                "rounded-full border px-3 py-1 font-mono transition-transform duration-150 hover:-translate-y-0.5",
                color,
              ].join(" ")}
            >
              {name}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
