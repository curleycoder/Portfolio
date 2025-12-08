import Head from "next/head";
export default function ResumePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Shabnam Beiraghian
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Apple Specialist Candidate · Customer-Obsessed Retail Professional
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-neutral-700 dark:text-neutral-300">
          <span>Burnaby, BC</span>
          <span>•</span>
          <a
            href="mailto:your.email@example.com"
            className="underline underline-offset-2"
          >
            your.email@example.com
          </a>
          <span>•</span>
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            LinkedIn
          </a>
        </div>

        <div className="pt-2 flex gap-3">
          <a
            href="/resume/pdf"
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            View PDF
          </a>
          <a
            href="/ShabnamBeiraghian_CASpecialist.pdf"
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
        <p className="mt-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-100">
          Energetic, customer-obsessed retail professional with 5+ years of
          high-volume customer service and product recommendation experience.
          Strong interest in technology (currently studying Full-Stack Web
          Development at BCIT) and eager to bring that to an Apple Retail team
          as a Specialist.
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        {/* LEFT: EXPERIENCE + EDUCATION */}
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Experience
            </h2>

            <div className="mt-4 space-y-6">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    Inside Automotive Sales Associate
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Jul 2022 – Mar 2025 · Vancouver, BC
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-800 dark:text-neutral-100">
                  <li>
                    Helped 100+ customers daily, diagnosing needs and recommending
                    the right parts.
                  </li>
                  <li>
                    Explained features, compatibility, and installation in simple,
                    clear language.
                  </li>
                  <li>
                    Coordinated with warehouse and delivery for accurate,
                    on-time orders.
                  </li>
                  <li>
                    Cleaned up catalog entries to speed up lookups and cut wait
                    times.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">Head Cashier</h3>
                  <span className="text-xs text-neutral-500">
                    Nov 2019 – Jul 2022 · Vancouver, BC
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-800 dark:text-neutral-100">
                  <li>Led front-end cash operations with zero discrepancies.</li>
                  <li>
                    Trained new cashiers on service standards and product basics.
                  </li>
                  <li>
                    Worked with management to keep checkouts aligned with overall
                    customer experience goals.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Education
            </h2>
            <div className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold">
                  Diploma, Full-Stack Web Development
                </h3>
                <span className="text-xs text-neutral-500">
                  Sep 2024 – Apr 2026 (in progress)
                </span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-200">
                British Columbia Institute of Technology (BCIT) — Vancouver, BC
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT: SKILLS */}
        <aside className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Key Skills
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-800 dark:text-neutral-100">
              <li>Customer service & experience</li>
              <li>Explaining products clearly</li>
              <li>High-volume communication</li>
              <li>Accountability and accuracy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Technology
            </h2>
            <p className="mt-2 text-sm text-neutral-800 dark:text-neutral-100">
              Currently studying advanced full-stack development at BCIT.
              Comfortable learning new tools quickly and helping others
              understand them.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
