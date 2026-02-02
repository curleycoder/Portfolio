import { Resend } from "resend";
import { insertBookingRequest, fetchBookingsBetween } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_TIME_SLOTS = new Set(["10:00", "11:00", "13:00", "14:00", "15:00"]);

function isValidISODateOnly(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const start = String(searchParams.get("start") || "").trim();
  const end = String(searchParams.get("end") || "").trim();

  if (!start || !end) return new Response("Missing start or end", { status: 400 });
  if (!isValidISODateOnly(start) || !isValidISODateOnly(end)) {
    return new Response("Invalid date format. Use YYYY-MM-DD.", { status: 400 });
  }
  if (start > end) return new Response("start must be <= end", { status: 400 });

  const bookings = await fetchBookingsBetween({ startDate: start, endDate: end });
  return json(Array.isArray(bookings) ? bookings : []);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim();
  const date = String(body.date || "").trim();
  const timeSlot = String(body.timeSlot || "").trim();
  const note = String(body.note || "").trim();

  // ✅ basic required fields
  if (!fullName || !email || !date || !timeSlot) {
    return new Response("Missing required fields", { status: 400 });
  }

  // ✅ validations
  if (fullName.length > 120) return new Response("Name too long", { status: 400 });
  if (!isValidEmail(email)) return new Response("Invalid email", { status: 400 });
  if (!isValidISODateOnly(date)) return new Response("Invalid date. Use YYYY-MM-DD.", { status: 400 });
  if (!ALLOWED_TIME_SLOTS.has(timeSlot)) return new Response("Invalid time slot", { status: 400 });
  if (note.length > 2000) return new Response("Note too long", { status: 400 });

  try {
    const booking = await insertBookingRequest({
      fullName,
      email,
      date,
      timeSlot,
      note,
    });

    // email (best-effort)
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      console.error("Missing CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL env vars");
    } else {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: `New booking request from ${fullName}`,
          reply_to: email,
          text: `
New booking request

Name: ${fullName}
Email: ${email}
Requested date: ${date}
Time: ${timeSlot}

Notes:
${note || "-"}
          `.trim(),
        });
      } catch (emailErr) {
        console.error("Resend email failed:", emailErr);
      }
    }

    return json(booking, 201);
  } catch (err) {
    // ✅ If you added UNIQUE(date, time_slot) this becomes reliable
    const code = err?.code || err?.cause?.code;

    // 23505 = Postgres unique_violation
    if (code === "23505") {
      return new Response("Time slot already booked", { status: 409 });
    }

    console.error("Error in POST /api/bookings:", err);
    return new Response("Failed to submit booking.", { status: 500 });
  }
}
