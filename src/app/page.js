import MyHero from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/project-card";
import GitHubCalendar from "@/components/github-calender";
import ParticlesHero from "@/components/ParticlesHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motions/Motion";

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
    <div className="relative">
      {/* ✅ page-local glow only (doesn't reset background / width) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
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