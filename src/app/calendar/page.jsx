import BookingCalendar from "./bookingCalendar";

export default function CalendarPage() {
  return (
    <div className="pt-10 sm:pt-14 lg:pt-18 space-y-6">
      <header className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Availability
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em]">
          Book a call or interview
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
          Pick a time that works for you. I&apos;ll confirm your booking by email.
        </p>
      </header>

      <section
        className="
          relative overflow-hidden rounded-2xl border border-border
          bg-card/70 backdrop-blur
          shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
        "
      >
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-primary/25" />
        <div className="p-5 sm:p-6">
          <BookingCalendar />
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}