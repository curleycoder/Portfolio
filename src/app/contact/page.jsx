import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-8">
      <header className="text-center space-y-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Contact
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl leading-[1.02] tracking-[-0.02em]">
          Contact Me
        </h1>

        <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground">
          Have a question or a project in mind? Send me a message and I’ll get back
          to you as soon as I can.
        </p>
      </header>

      <section
        className="
          relative overflow-hidden rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
        "
      >
        {/* micro accent line */}
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />

        <div className="p-5 sm:p-6 max-w-lg">
          <ContactForm />
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}