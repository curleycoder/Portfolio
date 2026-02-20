"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  today.setHours(12, 0, 0, 0); // DST-safe-ish
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

      setBookings((prev) => {
        const key = `${selectedDate}__${selectedTime}`;
        const next = prev.filter((b) => `${b?.date}__${b?.timeSlot}` !== key);
        next.push({ date: selectedDate, timeSlot: selectedTime });
        return next;
      });

      setMessage({ type: "success", text: "Request sent! I’ll email you to confirm." });

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
      <div className="overflow-x-auto rounded-2xl border border-border bg-card/60 backdrop-blur p-4">
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
                  "flex flex-col rounded-2xl border px-3 py-2 text-xs transition-colors",
                  isSelectedDay
                    ? "border-primary/35 bg-accent/40"
                    : "border-border bg-background/25",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => selectDay(dateISO)}
                  className="
                    mb-2 rounded-xl px-2 py-1 text-left font-semibold text-foreground
                    hover:bg-accent/50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                    focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  "
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
                          "w-full rounded-xl px-2 py-1 text-[11px] transition-colors",
                          "border border-border",
                          booked
                            ? "cursor-not-allowed bg-background/20 text-muted-foreground/70 opacity-70"
                            : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/30 text-foreground hover:bg-accent/60",
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
        className="space-y-4 rounded-2xl border border-border bg-card/60 backdrop-blur p-4 sm:p-5 text-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Request
            </div>
            <h2 className="mt-1 text-base font-semibold text-foreground">
              Request this time
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Selected:{" "}
              {selectedDate && selectedTime
                ? `${selectedDate} at ${selectedTime}`
                : "No time selected yet"}
            </p>
          </div>

          {selectedDate && selectedTime ? (
            <span className="mt-1 inline-flex items-center rounded-full border border-border bg-card/30 px-3 py-1 text-[11px] text-muted-foreground">
              {selectedTime}
            </span>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Full name
            </label>
            <Input
              name="fullName"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Notes (optional)
          </label>
          <Textarea
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything you’d like me to know before the call."
          />
        </div>

        {message && (
          <div
            className={[
              "rounded-xl border px-3 py-2 text-xs",
              message.type === "success"
                ? "border-border bg-accent/40 text-foreground"
                : "border-destructive/40 bg-destructive/10 text-foreground",
            ].join(" ")}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Request booking"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime("");
              setMessage(null);
            }}
            disabled={submitting && !message}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}