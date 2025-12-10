import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Contact Me
          </h1>
          <p className="text-sm text-neutral-400 p-4">
            Have a question or a project in mind? Send me a message and I’ll get
            back to you as soon as I can.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-4 sm:p-6 shadow-lg shadow-black/40">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
