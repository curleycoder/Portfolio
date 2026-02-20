export default function ResumePage() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-10">
      {/* HEADER */}
      <header
        className="
          relative overflow-hidden rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          p-6 sm:p-8
        "
      >
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Resume
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl leading-[1.02] tracking-[-0.02em]">
            Shabnam Beiraghian
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground">
            Full Stack Developer
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>Burnaby, BC</span>
            <span className="opacity-60">•</span>

            <a
              href="mailto:shabnambeiraghian@gmail.com"
              className="underline underline-offset-4 decoration-border hover:text-foreground"
            >
              shabnambeiraghian@gmail.com
            </a>

            <span className="opacity-60">•</span>

            <a
              href="https://github.com/curleycoder"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 decoration-border hover:text-foreground"
            >
              github.com/curleycoder
            </a>

            <span className="opacity-60">•</span>

            <a
              href="https://www.linkedin.com/in/shabnam-beiraghian/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 decoration-border hover:text-foreground"
            >
              linkedin.com/in/shabnam-beiraghian
            </a>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <a
              href="/resume/pdf"
              className="
                inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold
                border border-border bg-card/30 text-foreground
                transition hover:bg-accent/60
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                no-underline
              "
            >
              View PDF
            </a>

            <a
              href="/Shabnam_Beiraghian_Resume.pdf"
              className="
                inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold
                bg-primary text-primary-foreground border border-border
                transition hover:opacity-90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                no-underline
              "
            >
              Download PDF
            </a>
          </div>
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        {/* LEFT */}
        <div className="space-y-10">
          {/* PROJECTS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Projects
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-6">
              <ResumeItem
                title="Frontend Developer & Technical Project Manager — Forge — Mobile Application"
                date="Sep 2025 – Dec 2025"
                bullets={[
                  "Built a mobile application in an 8-person cross-disciplinary team to help high-school students explore skilled-trade career pathways.",
                  "Implemented UI components from UX designs and integrated AI-assisted features in an Agile workflow.",
                ]}
              />

              <ResumeItem
                title="Full Stack Developer & Scrum Master — LendItOut — Web Application"
                date="Apr 2025 – May 2025"
                bullets={[
                  "Developed a responsive web application in a 3-person team based on Figma designs.",
                  "Converted high-fidelity UI/UX mockups into a functional live application.",
                ]}
              />
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Experience
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-6">
              <ResumeItem
                title="Full-Stack Developer — Community of Guardians (Internship)"
                date="Jan 2026 – Present"
                bullets={[
                  "Developing and maintaining features for a nonprofit social platform aligned with UN Sustainable Development Goals.",
                  "Collaborating with a cross-functional team using Agile practices (Git, Taiga, code reviews).",
                  "Building responsive front-end components and integrating them with backend APIs.",
                ]}
              />

              <ResumeItem
                title="Full-Stack Developer — Beautyshohre Studio"
                date="Jun 2025 – Present"
                bullets={[
                  "Designed, built, and deployed a production full-stack web application for a real beauty business.",
                  "Implemented online booking, scheduling logic, admin dashboard, and client management features.",
                  "Owned the project end-to-end: requirements, architecture, deployment, and post-launch updates.",
                  "Providing ongoing maintenance, updates, and feature enhancements based on client needs.",
                ]}
              />

              <ResumeItem
                title="Customer Operations & Team Lead (Sales & Cash) — Lordco Auto Parts"
                date="Nov 2019 – Mar 2025"
                bullets={[
                  "Assisted ~100 customers daily (phone & in-person), diagnosing needs and recommending correct automotive parts.",
                  "Led and scheduled a team of 4 cashiers in a high-volume environment.",
                  "Handled high-volume cash and card transactions; reconciled daily balances and prepared deposits.",
                ]}
              />
            </div>
          </section>

          {/* EDUCATION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Education
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              <TwoColRow
                left="BCIT Downtown | Full-Stack Web Development, Diploma"
                right="Sep 2024 – Apr 2026"
              />
              <TwoColRow
                left="Azad University | Architectural Engineering, Bachelor’s Degree"
                right="Sep 2014 – Jan 2019"
              />
            </div>
          </section>

          {/* AWARDS */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Awards
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <p className="text-sm text-foreground/90">
              Pam and Jerry Bastien Bursary; BCIT Special Bursaries{" "}
              <span className="text-muted-foreground">· March 2025</span>
            </p>
          </section>

          {/* VOLUNTEER */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Volunteer Experience
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <p className="text-sm text-foreground/90">
              BCIT Women In Computing (WiC) | Social Media Director{" "}
              <span className="text-muted-foreground">· Sep 2025 – Present</span>
            </p>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-8">
          <section
            className="
              rounded-2xl border border-border bg-card/60 backdrop-blur
              shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)]
              p-5 sm:p-6
            "
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Technical Skills
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-5 space-y-6">
              <SkillBlock
                label="Languages & Frameworks"
                text="HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Node.js, Hono, PHP, .NET, Python, C#"
              />
              <SkillBlock
                label="Databases & Backend"
                text="MongoDB, MySQL, PostgreSQL, SQL, Prisma"
              />
              <SkillBlock
                label="Tools & Platforms"
                text="Git, GitHub, VS Code, Vercel, Render, Jira, Trello, Slack, Linux, AWS (S3), CI/CD, Figma, MySQL WorkBench, RESTful APIs, Authentication (Clerk), Responsive Design, UI/UX Principles, SEO, E-commerce Concepts, Agile Development, OOP, Xcode"
              />
            </div>
          </section>
        </aside>
      </div>

      <div className="h-10" />
    </div>
  );
}

/* helpers (keep file self-contained) */

function ResumeItem({ title, date, bullets }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <ul className="space-y-1 pl-5 text-sm text-muted-foreground [&>li]:list-item list-disc">
        {(bullets || []).map((b, idx) => (
          <li key={idx} className="text-foreground/90">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwoColRow({ left, right }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-base font-semibold text-foreground">{left}</h3>
      <span className="text-xs text-muted-foreground">{right}</span>
    </div>
  );
}

function SkillBlock({ label, text }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground/90">{text}</p>
    </div>
  );
}