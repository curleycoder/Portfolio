export const dynamic = "force-dynamic";

import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-card";
import GitHubCalendar from "@/components/github-calender";
import Footer from "@/components/footer";

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
      <div className="pointer-eve absolute inset-0">
          <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-purple-500/18 blur-3xl" />
          <div className="absolute right-20 top-40 h-72 w-72 rounded-full bg-purple-500/14 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      </div>

      {/* CONTENT */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-8 md:px-6 md:pt-12">
        <section className="flex flex-col gap-6">
          {/* HERO */}
          <Reveal className="relative">
            <div className="relative group ">
              {/* particles ONLY here */}
              <div className="absolute inset-0">
                <ParticlesHero />
              </div>

              <div className="relative">
                <div className="h-0.5 w-full bg-linear-to-r from-blue-pink/70  to-transparent opacity-80" />
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
            <section className="group relative overflow-hidden rounded-2xl  bg-neutral-950/60 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
              {/* micro accent line */}
              <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/30" />
              <div className="pointer-events-none absolute left-6 top-0 h-0.5 w-36 bg-purple-400/30" />

              <div className="relative p-5 sm:p-6">
                <header className="mb-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                      What I build with
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
                      Stack
                    </h2>
                  </div>
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-600/80 opacity-70" />
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                  <SkillGroup title="Frontend" items={skills.frontend} />
                  <SkillGroup title="Backend & Databases" items={skills.backend} />
                  <SkillGroup title="Mobile" items={skills.mobile} />
                  <SkillGroup title="DevOps & Deployment" items={skills.dev} />
                  <SkillGroup title="Tools & Workflow" items={skills.tools} />
                  <SkillGroup title="Leadership & Delivery" items={skills.del} />
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400/70" />
                  <span className="font-mono">Clean UI · Reliable flows · Shipped projects</span>
                </div>
              </div>
            </section>
          </Reveal>
        </section>
        <section className="group relative overflow-hidden rounded-2xl  bg-neutral-950/60 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
        
              {/* micro accent line */}
            <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/30" />
            <div className="pointer-events-none absolute left-100 top-0 h-0.5 w-36 bg-purple-400/30" />
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-600/80 opacity-70" />
        {/* PROJECTS */}
        <Reveal delay={0.05}>
          <ProjectPreviewCard count={3} />
        </Reveal>
        </section>
           <section className="group relative overflow-hidden rounded-2xl  bg-neutral-950/60 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
              {/* micro accent line */}
              <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-purple-800/30" />
              <div className="pointer-events-none absolute left-200 top-0 h-0.5 w-36 bg-purple-400/30" />
        <span className="mt-1 h-2 w-2 rounded-full bg-purple-600/80 opacity-70" />

        {/* GITHUB */}
        <Reveal delay={0.08}>
          {/* <section> */}
          <GitHubCalendar />
          {/* </section> */}
        </Reveal>
        </section>
      </div>
    </main>
  );
}

function SkillGroup({ title, items }) {
  return (
    <div className="rounded-xl  border-neutral-900 bg-neutral-950/40 p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
          {title}
        </span>
        <span className="h-px flex-1 bg-pink-500/20" />
      </div>

      <Stagger className="flex flex-wrap gap-2" delayChildren={0.02} stagger={0.03}>
        {items.map((name) => (
          <StaggerItem key={name}>
            <span className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 font-mono text-[11px] text-neutral-200 transition-all duration-200">
              {name}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

