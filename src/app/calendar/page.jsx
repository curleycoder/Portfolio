import BookingCalendar from "./bookingCalendar";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
            Availability
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Book a call or interview
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Pick a time that works for you. I&apos;ll confirm your booking by
            email.
          </p>
        </header>

        <BookingCalendar />
      </div>
    </main>
  );
}
