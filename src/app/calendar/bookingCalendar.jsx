"use client";

import { useEffect, useMemo, useState } from "react";

const TIME_SLOTS = ["10:00", "11:00", "13:00", "14:00", "15:00"];

// ✅ Local YYYY-MM-DD (prevents UTC date shift bugs)
function formatDateLocalISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function makeNext7Days() {
  const days = [];
  const today = new Date();
  // normalize to noon to avoid DST edge weirdness
  today.setHours(12, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error"|"success", text: string }

  const days = useMemo(() => makeNext7Days(), []);

  const bookedSet = useMemo(() => {
    const s = new Set();
    for (const b of bookings) {
      if (!b?.date || !b?.timeSlot) continue;
      s.add(`${b.date}__${b.timeSlot}`);
    }
    return s;
  }, [bookings]);

  useEffect(() => {
    let alive = true;

    const start = formatDateLocalISO(days[0]);
    const end = formatDateLocalISO(days[days.length - 1]);

    fetch(`/api/bookings?start=${start}&end=${end}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!alive) return;
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!alive) return;
        setBookings([]);
      });

    return () => {
      alive = false;
    };
  }, [days]);

  function isSlotBooked(dateISO, time) {
    return bookedSet.has(`${dateISO}__${time}`);
  }

  function selectDay(dateISO) {
    setSelectedDate(dateISO);
    // ✅ prevent mismatched day/time
    setSelectedTime("");
    setMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const name = fullName.trim();
    const mail = email.trim();
    const memo = note.trim();

    if (!selectedDate || !selectedTime) {
      setMessage({ type: "error", text: "Please select a day and time first." });
      return;
    }
    if (!name) {
      setMessage({ type: "error", text: "Full name is required." });
      return;
    }
    if (!mail || !isValidEmail(mail)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (isSlotBooked(selectedDate, selectedTime)) {
      setMessage({ type: "error", text: "That time is already booked. Please pick another slot." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email: mail,
          note: memo,
          date: selectedDate,
          timeSlot: selectedTime,
        }),
      });

      if (res.status === 409) {
        setMessage({ type: "error", text: "That slot was just taken. Please choose another time." });
        // optional: refresh bookings for accuracy
        const start = formatDateLocalISO(days[0]);
        const end = formatDateLocalISO(days[days.length - 1]);
        fetch(`/api/bookings?start=${start}&end=${end}`)
          .then((r) => (r.ok ? r.json() : []))
          .then((data) => setBookings(Array.isArray(data) ? data : []))
          .catch(() => {});
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit booking.");
      }

      // ✅ dedupe & add
      setBookings((prev) => {
        const key = `${selectedDate}__${selectedTime}`;
        const next = prev.filter((b) => `${b?.date}__${b?.timeSlot}` !== key);
        next.push({ date: selectedDate, timeSlot: selectedTime });
        return next;
      });

      setMessage({ type: "success", text: "Request sent! I’ll email you to confirm." });

      // clear inputs
      setFullName("");
      setEmail("");
      setNote("");
      setSelectedTime("");
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Something went wrong." });
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
            const dateISO = formatDateLocalISO(date);
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
                  onClick={() => selectDay(dateISO)}
                  className="mb-2 rounded-md px-1 text-left font-semibold text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  {label}
                </button>

                <div className="space-y-1">
                  {TIME_SLOTS.map((slot) => {
                    const booked = isSlotBooked(dateISO, slot);
                    const isActive = isSelectedDay && selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => {
                          setSelectedDate(dateISO);
                          setSelectedTime(slot);
                          setMessage(null);
                        }}
                        className={[
                          "w-full rounded-md px-2 py-1 text-[11px] transition-colors",
                          booked
                            ? "cursor-not-allowed bg-neutral-800/60 text-neutral-500"
                            : isActive
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
                        ].join(" ")}
                      >
                        {slot}
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
        className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 text-sm"
      >
        <h2 className="text-base font-semibold text-neutral-50">Request this time</h2>

        <p className="text-xs text-neutral-400">
          Selected:{" "}
          {selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : "No time selected yet"}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Full name
            </label>
            <input
              name="fullName"
              required
              autoComplete="name"
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
              name="email"
              required
              autoComplete="email"
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
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
            placeholder="Anything you’d like me to know before the call."
          />
        </div>

        {message && (
          <p
            className={[
              "rounded-md border px-3 py-2 text-xs",
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-200"
                : "border-red-500/30 bg-red-500/10 text-red-200",
            ].join(" ")}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Request booking"}
        </button>
      </form>
    </div>
  );
}
