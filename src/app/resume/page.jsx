export const dynamic = "force-dynamic";

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Shabnam Beiraghian</h1>

        <p className="text-lg text-neutral-400 dark:text-neutral-300">
          Full Stack Developer
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-blue-300 dark:text-neutral-300">
          <span>Burnaby, BC</span>
          <span>•</span>
          <a
            href="mailto:shabnambeiraghian@gmail.com"
            className="underline underline-offset-2"
          >
            shabnambeiraghian@gmail.com
          </a>
          <span>•</span>
          
          <a
            href="https://github.com/curleycoder"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            github.com/curleycoder
          </a>
          <span>•</span>
          <a
            href="https://www.linkedin.com/in/shabnam-beiraghian/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            linkedin.com/in/shabnam-beiraghian/
          </a>
        </div>

        <div className="pt-2 flex gap-3">
          <a
            href="/resume/pdf"
            className="inline-flex items-center rounded-md border border-blue-500/80 px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-300/80 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            View PDF
          </a>
          <a
            href="/Shabnam_Beiraghian_Resume.pdf"
            className="inline-flex items-center rounded-md bg-blue-500/80 px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-800/60 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            Download PDF
          </a>
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        {/* LEFT: PROJECTS + EXPERIENCE + EDUCATION + AWARDS + VOLUNTEER */}
        <div className="space-y-10">
          {/* PROJECTS */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Projects
            </h2>

            <div className="mt-4 space-y-6">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Frontend Developer &amp; Technical Project Manager — Forge — Mobile Application
                  </h3>
                  <span className="text-xs text-neutral-500">Sep 2025 – Dec 2025</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Built a mobile application in an 8-person cross-disciplinary team to help high-school
                    students explore skilled-trade career pathways.
                  </li>
                  <li>
                    Implemented UI components from UX designs and integrated AI-assisted features in an Agile workflow.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Full Stack Developer &amp; Scrum Master — LendItOut — Web Application
                  </h3>
                  <span className="text-xs text-neutral-500">Apr 2025 – May 2025</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Developed a responsive web application in a 3-person team based on Figma designs.
                  </li>
                  <li>
                    Converted high-fidelity UI/UX mockups into a functional live application.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Experience
            </h2>

            <div className="mt-4 space-y-6">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Full-Stack Developer — Community of Guardians (Internship)
                  </h3>
                  <span className="text-xs text-neutral-500">Jan 2026 – Present</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Developing and maintaining features for a nonprofit social platform aligned with UN Sustainable Development Goals.
                  </li>
                  <li>
                    Collaborating with a cross-functional team using Agile practices (Git, Taiga, code reviews).
                  </li>
                  <li>
                    Building responsive front-end components and integrating them with backend APIs.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Full-Stack Developer — Beautyshohre Studio
                  </h3>
                  <span className="text-xs text-neutral-500">Jun 2025 – Present</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Designed, built, and deployed a production full-stack web application for a real beauty business.
                  </li>
                  <li>
                    Implemented online booking, scheduling logic, admin dashboard, and client management features.
                  </li>
                  <li>
                    Owned the project end-to-end: requirements, architecture, deployment, and post-launch updates.
                  </li>
                  <li>
                    Providing ongoing maintenance, updates, and feature enhancements based on client needs.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Customer Operations &amp; Team Lead (Sales &amp; Cash) — Lordco Auto Parts
                  </h3>
                  <span className="text-xs text-neutral-500">Nov 2019 – Mar 2025</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Assisted ~100 customers daily (phone &amp; in-person), diagnosing needs and recommending correct automotive parts.
                  </li>
                  <li>
                    Led and scheduled a team of 4 cashiers in a high-volume environment.
                  </li>
                  <li>
                    Handled high-volume cash and card transactions; reconciled daily balances and prepared deposits.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Education
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    BCIT Downtown | Full-Stack Web Development, Diploma
                  </h3>
                  <span className="text-xs text-neutral-500">Sep 2024 – Apr 2026</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Azad University | Architectural Engineering, Bachelor’s Degree
                  </h3>
                  <span className="text-xs text-neutral-500">Sep 2014 – Jan 2019</span>
                </div>
              </div>
            </div>
          </section>

          {/* AWARDS */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Awards
            </h2>

            <div className="mt-4 text-sm text-neutral-400 dark:text-neutral-100">
              Pam and Jerry Bastien Bursary; BCIT Special Bursaries{" "}
              <span className="text-neutral-500">· March 2025</span>
            </div>
          </section>

          {/* VOLUNTEER */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Volunteer Experience
            </h2>

            <div className="mt-4 text-sm text-neutral-400 dark:text-neutral-100">
              BCIT Women In Computing (WiC) | Social Media Director{" "}
              <span className="text-neutral-500">· Sep 2025 – Present</span>
            </div>
          </section>
        </div>

        {/* RIGHT: TECHNICAL SKILLS */}
        <aside className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Technical Skills
            </h2>

            <div className="mt-4 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Languages &amp; Frameworks
                </p>
                <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-100">
                  HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Node.js, Hono, PHP, .NET, Python, C#
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Databases &amp; Backend
                </p>
                <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-100">
                  MongoDB, MySQL, PostgreSQL, SQL, Prisma
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Tools &amp; Platforms
                </p>
                <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-100">
                  Git, GitHub, VS Code, Vercel, Render, Jira, Trello, Slack, Linux, AWS (S3), CI/CD, Figma,
                  MySQL WorkBench, RESTful APIs, Authentication (Clerk), Responsive Design, UI/UX Principles,
                  SEO, E-commerce Concepts, Agile Development, OOP, X-Code
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
