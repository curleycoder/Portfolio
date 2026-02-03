import BookingCalendar from "./bookingCalendar";

export default function CalendarPage() {
  return (
    <main className="bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
            Availability
          </p>

          <h1 className="text-2xl font-semibold tracking-tight">
            Book a call or interview
          </h1>

          <p className="max-w-2xl text-sm text-neutral-400">
            Pick a time that works for you. I&apos;ll confirm your booking by email.
          </p>
        </header>

        <BookingCalendar />
      </div>
    </main>
  );
}
