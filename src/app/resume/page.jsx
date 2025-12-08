import Head from "next/head";

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Shabnam Beiraghian
        </h1>

        <p className="text-lg text-neutral-400 dark:text-neutral-300">
          Full-Stack Web Developer
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
            href="https://www.linkedin.com/in/shabnam-beiraghian/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            LinkedIn
          </a>
          <span>•</span>
          <a
            href="https://github.com/curleycoder"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            GitHub
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

      {/* PROFILE */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Profile
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400 dark:text-neutral-100">
          Full-Stack Web Development student at BCIT with a background in
          Architecture Engineering and a strong foundation in design thinking,
          problem-solving, and technical precision. Transitioning into software
          development by combining an architectural mindset—systems thinking,
          structured planning, and visual communication—with modern web
          technologies. Experienced in high-volume customer service and
          technical product education. Currently volunteering as Social Media
          Director for the Women in Computing Club at BCIT, managing digital
          content, campaigns, and community engagement.
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        {/* LEFT: EXPERIENCE + EDUCATION */}
        <div className="space-y-8">
          {/* EXPERIENCE */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Experience
            </h2>

            <div className="mt-4 space-y-6">
              {/* Social Media Director */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Social Media Director (Volunteer)
                  </h3>
                  <span className="text-xs text-neutral-500">
                    2025 – Present · Burnaby, BC
                  </span>
                </div>
                <p className="text-sm text-neutral-400 dark:text-neutral-200">
                  Women in Computing Club · BCIT
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Manage digital content, social campaigns, and event
                    promotion for the Women in Computing Club.
                  </li>
                  <li>
                    Create graphics, announcements, and community posts across
                    Instagram, Discord, and LinkedIn.
                  </li>
                  <li>
                    Support club leadership with event organization, outreach,
                    and digital communications.
                  </li>
                </ul>
              </div>

              {/* Inside Automotive */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Inside Automotive Sales Associate
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Jul 2022 – Mar 2025 · Vancouver, BC
                  </span>
                </div>
                <p className="text-sm text-neutral-400 dark:text-neutral-200">
                  Lordco / Inside Automotive
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Ranked #1 in cash sales among seven associates and achieved
                    the second-highest total charge revenue.
                  </li>
                  <li>
                    Served 100+ customers per day, recommending compatible
                    parts and explaining technical details in simple language.
                  </li>
                  <li>
                    Guided customers through troubleshooting and part selection
                    for repairs and upgrades.
                  </li>
                  <li>
                    Coordinated with warehouse and delivery teams to ensure
                    fast, accurate order fulfillment.
                  </li>
                </ul>
              </div>

              {/* Head Cashier */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">Head Cashier</h3>
                  <span className="text-xs text-neutral-500">
                    Nov 2019 – Jul 2022 · Vancouver, BC
                  </span>
                </div>
                <p className="text-sm text-neutral-400 dark:text-neutral-200">
                  Retail Store
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
                  <li>
                    Led front-end operations, trained new cashiers, and
                    maintained zero cash discrepancies.
                  </li>
                  <li>
                    Handled complex customer inquiries, returns, and payment
                    issues with a calm, solution-focused approach.
                  </li>
                  <li>
                    Improved checkout efficiency by optimizing queues and
                    troubleshooting POS issues.
                  </li>
                  <li>
                    Earned the ACDelco Sky Trip Award for outstanding sales
                    performance and customer satisfaction.
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
                    Diploma, Full-Stack Web Development
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Sep 2024 – Apr 2026 (In Progress)
                  </span>
                </div>
                <p className="text-sm text-neutral-400 dark:text-neutral-200">
                  British Columbia Institute of Technology (BCIT) — Burnaby, BC
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Bachelor’s Degree, Architecture Engineering
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Sep 2015 – Completed
                  </span>
                </div>
                <p className="text-sm text-neutral-400 dark:text-neutral-200">
                  Azad University — Iran
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: SKILLS */}
        <aside className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Key Skills
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-400 dark:text-neutral-100">
              <li>
                Full-Stack Development (JavaScript, React, Next.js, Node.js —
                in progress)
              </li>
              <li>UI/UX fundamentals & design thinking</li>
              <li>Product education & technical explanation</li>
              <li>Sales performance & metric-driven communication</li>
              <li>Content creation & social media management</li>
              <li>Problem-solving, accuracy, and accountability</li>
              <li>Team collaboration & leadership</li>
            </ul>
          </section>

          <section>
  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
    Technology
  </h2>

  {/* SMALL STATUS BAR STYLE */}
  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-300">

    {/* TECH BADGES */}
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      JavaScript
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      TypeScript
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      HTML & EJS
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      CSS & Tailwind
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      React
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      React Native
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Expo
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
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Neon Serverless SQL
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      PostgreSQL
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Drizzle ORM
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Node.js
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Git & GitHub
    </span>
  </div>

</section>
<section className="mt-6">
  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
    Tools
  </h2>

  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-300">
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      VS Code
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      GitHub Desktop
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Terminal · zsh
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Postman
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Figma
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Chrome DevTools
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      macOS · Linux
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Xcode
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Expo Go
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Notion
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Jira
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Cloud deployment (Vercel · Render)
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Neon Dashboard
    </span>
  </div>
</section>

{/* CURRENTLY LEARNING */}
<section className="mt-6">
  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
    Currently Learning
  </h2>

  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-300">
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Advanced TypeScript
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Testing (Jest · React Testing Library)
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Accessibility &amp; Performance
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      CI/CD · GitHub Actions
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Design Systems · Component libraries
    </span>
    <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      Python
    </span>
        <span className="rounded-full border border-neutral-700/80 bg-neutral-900/70 px-3 py-1">
      C#
    </span>
  </div>
</section>

        </aside>
      </div>
    </main>
  );
}
