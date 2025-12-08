import Head from "next/head";

export default function ResumePdfPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-2xl font-semibold">Resume (PDF)</h1>
        <a
          href="/resume.pdf"
          className="inline-flex items-center rounded-md border border-blue-500/80  px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-500/80 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          Download
        </a>
      </header>

      <section className="h-[80vh] w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
        <embed
          src="/resume.pdf#view=FitH"
          type="application/pdf"
          className="h-full w-full"
        />
      </section>
    </main>
  );
}
