"use client";

import { useEffect, useMemo, useState } from "react";

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

function formatDateISO(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function makeNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const days = useMemo(() => makeNext7Days(), []);

  // load bookings for the next 7 days
  useEffect(() => {
    const start = formatDateISO(days[0]);
    const end = formatDateISO(days[days.length - 1]);

    fetch(`/api/bookings?start=${start}&end=${end}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, [days]);

  function isSlotBooked(dateISO, time) {
    return bookings.some(
      (b) => b.date === dateISO && b.timeSlot === time
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!selectedDate || !selectedTime) {
      setMessage("Please select a day and time first.");
      return;
    }
    if (!fullName || !email) {
      setMessage("Name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          note,
          date: selectedDate,
          timeSlot: selectedTime,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit booking.");
      }

      setMessage("Request sent! I’ll email you to confirm.");
      setNote("");
      // optionally re-fetch bookings to mark this slot taken:
      setBookings((prev) => [
        ...prev,
        { date: selectedDate, timeSlot: selectedTime },
      ]);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar grid */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
        <div className="grid gap-4 md:grid-cols-7">
          {days.map((date) => {
            const dateISO = formatDateISO(date);
            const label = date.toLocaleDateString("en-CA", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            const isSelectedDay = selectedDate === dateISO;

            return (
              <div
                key={dateISO}
                className={[
                  "flex flex-col rounded-xl border px-3 py-2 text-xs",
                  isSelectedDay
                    ? "border-blue-500/80 bg-blue-500/10"
                    : "border-neutral-700 bg-neutral-900",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setSelectedDate(dateISO)}
                  className="mb-2 text-left font-semibold text-neutral-100"
                >
                  {label}
                </button>

                <div className="space-y-1">
                  {TIME_SLOTS.map((slot) => {
                    const booked = isSlotBooked(dateISO, slot);
                    const isActive =
                      isSelectedDay && selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => {
                          setSelectedDate(dateISO);
                          setSelectedTime(slot);
                        }}
                        className={[
                          "w-full rounded-md px-2 py-1 text-[11px]",
                          booked
                            ? "cursor-not-allowed bg-neutral-800 text-neutral-500 line-through"
                            : isActive
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
                        ].join(" ")}
                      >
                        {slot} {booked ? "(booked)" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-4 text-sm"
      >
        <h2 className="text-base font-semibold text-neutral-50">
          Request this time
        </h2>

        <p className="text-xs text-neutral-400">
          Selected:{" "}
          {selectedDate && selectedTime
            ? `${selectedDate} at ${selectedTime}`
            : "No time selected yet"}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Notes (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
            placeholder="Anything you’d like me to know before the call."
          />
        </div>

        {message && (
          <p className="text-xs text-neutral-300">{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Request booking"}
        </button>
      </form>
    </div>
  );
}
