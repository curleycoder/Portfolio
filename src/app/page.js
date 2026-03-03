import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-card";
import GitHubCalendar from "@/components/github-calender";
import ParticlesHero from "@/components/ParticlesHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motions/Motion";
import Link from "next/link";
import { Target, Flame, Lock, Keyboard } from "lucide-react";

const hero = {
  avatar: "/ai.png",
  fullName: "Shabnam Beiraghian",
  shortDescription:
    "BCIT Full-Stack Web Development student focused on accessibility, product delivery, and real-world Next.js apps.",
  longDescription:
    "I’m transitioning from fast-paced, customer-facing work into software development. I build practical web apps with Next.js, React, Tailwind, and Auth0—with a strong focus on accessibility, clean UI, and reliable delivery using Scrum.",
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

function SkillGroup({ title, items }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 backdrop-blur p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </span>
        <span className="h-px flex-1 bg-primary/20" />
      </div>

      <Stagger className="flex flex-wrap gap-2" delayChildren={0.02} stagger={0.03}>
        {items.map((name) => (
          <StaggerItem key={name}>
            <span className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[11px] text-foreground transition hover:bg-accent/60">
              {name}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function GlassSection({ children, className = "" }) {
  return (
    <section
      className={[
        "group relative overflow-hidden rounded-2xl border border-border",
        "bg-card/70 text-card-foreground backdrop-blur",
        "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {/* micro accent line */}
      <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />
      <div className="pointer-events-none absolute left-10 top-0 h-0.5 w-36 bg-primary/20" />
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
        <div className="relative overflow-x-hidden">
      {/* ✅ page-local glow only (doesn't reset background / width) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-20 top-40 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
      </div>

      {/* ✅ consistent vertical rhythm (hen-ry spacing) */}
      <div className="flex flex-col gap-10 pt-10 sm:pt-14 lg:pt-18">
        {/* HERO */}
        <section className="flex flex-col gap-6">
          <Reveal className="relative">
            <div className="relative">
              <div className="absolute inset-0">
                <ParticlesHero />
              </div>

              <div className="relative">
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
            <GlassSection>
              <div className="p-5 sm:p-6">
                <header className="mb-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      What I build with (accessibility-first)
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">Stack</h2>
                  </div>
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary/80 opacity-70" />
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                  <SkillGroup title="Frontend" items={skills.frontend} />
                  <SkillGroup title="Backend & Databases" items={skills.backend} />
                  <SkillGroup title="Mobile" items={skills.mobile} />
                  <SkillGroup title="DevOps & Deployment" items={skills.dev} />
                  <SkillGroup title="Tools & Workflow" items={skills.tools} />
                  <SkillGroup title="Leadership & Delivery" items={skills.del} />
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span className="font-mono">
                    Clean UI · Reliable flows · Shipped projects
                  </span>
                </div>
              </div>
            </GlassSection>
          </Reveal>
        </section>

        {/* PROJECTS */}
        <Reveal delay={0.05}>
          {/* <GlassSection> */}
            <div className="p-5 sm:p-6">
              <ProjectPreviewCard count={2} />
            </div>
          {/* </GlassSection> */}
        </Reveal>

        {/* ESCAPE GAME TEASER */}
{/* ESCAPE GAME TEASER */}
<Reveal delay={0.07}>
  <GlassSection className="relative overflow-hidden">
    {/* background accents */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/14 blur-3xl" />
      <div className="absolute right-10 top-28 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-1/3 -bottom-24 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
    </div>

    <div className="p-5 sm:p-7">
      {/* top line */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono text-muted-foreground">
          NEW • Interactive
        </span>
        <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono text-muted-foreground">
          Keyboard-only
        </span>
        <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono text-muted-foreground">
          Mac / Windows
        </span>

        <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
          <span className="font-mono">Mission: Escape the Editor</span>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT: headline + CTAs */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Escape the Editor
            <span className="text-muted-foreground"> — VS Code Shortcuts Run</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
            A mini escape-room where you unlock “locks” using real VS Code shortcuts.
            Fast feedback, streaks, hints, and a fake editor that shows what each shortcut does.
          </p>

          {/* “loot” */}
          <div className="mt-8 mb-22 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono">
              <Target size={14} className="opacity-80" />
              Score
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono">
              <Flame size={14} className="opacity-80" />
              Streak
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono">
              <Lock size={14} className="opacity-80" />
              Locks
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-mono">
              <Keyboard size={14} className="opacity-80" />
              Real key detection
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/escape"
              className="group inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition no-underline"
            >
              <span className=" rounded-full px-2 text-[16px] font-mono">
                START
              </span>
              {/* <span>Play</span> */}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>

            <Link
              href="/projects"
              className=" no-underline rounded-2xl border border-border px-5 py-3.5 text-sm font-semibold hover:bg-accent/60 transition"
            >
              See Projects
            </Link>

            <div className="ml-auto hidden sm:block text-[11px] text-muted-foreground">
              Tip: click the editor, then press keys.
            </div>
          </div>
        </div>

        {/* RIGHT: “terminal / game panel” */}
        <div className="rounded-2xl border border-border bg-background/35 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Mission Brief
            </div>
            <span className="h-2 w-2 rounded-full bg-primary/80 opacity-80" />
          </div>

          <div className="mt-3 rounded-xl border border-border bg-background/40 p-4">
            <div className="text-sm font-semibold">Objective</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Unlock 7 locks using correct shortcuts. No typing answers.
            </div>

            <div className="mt-4 grid gap-2 text-[12px] font-mono">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                <span className="text-muted-foreground">Lock 1</span>
                <span>Go to Line…</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                <span className="text-muted-foreground">Lock 2</span>
                <span>Copy Line ↓</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                <span className="text-muted-foreground">Lock 3</span>
                <span>Multi-cursor (Next Match)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">Systems showcased</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background/35 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Logic</div>
                <div className="text-sm font-semibold">State flow + inputs</div>
              </div>
              <div className="rounded-lg border border-border bg-background/35 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">UX</div>
                <div className="text-sm font-semibold">Feedback + scoring</div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-muted-foreground">
            Looks like a game. Built like a real app.
          </div>
        </div>
      </div>
    </div>
  </GlassSection>
</Reveal>

        {/* GITHUB */}
        <Reveal delay={0.08}>
          <GlassSection>
            <div className="p-5 sm:p-6">
              <GitHubCalendar />
            </div>
          </GlassSection>
        </Reveal>

        {/* bottom breathing room before footer in RootLayout */}

      </div>
    </div>
  );
}