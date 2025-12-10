import { Resend } from "resend";
import {
  insertBookingRequest,
  fetchBookingsBetween,
} from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return new Response("Missing start or end", { status: 400 });
  }

  const bookings = await fetchBookingsBetween({
    startDate: start,
    endDate: end,
  });

  return new Response(JSON.stringify(bookings), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const fullName = (body.fullName || "").trim();
  const email = (body.email || "").trim();
  const date = (body.date || "").trim();
  const timeSlot = (body.timeSlot || "").trim();
  const note = (body.note || "").trim();

  if (!fullName || !email || !date || !timeSlot) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    // 1) Save booking in DB
    const booking = await insertBookingRequest({
      fullName,
      email,
      date,
      timeSlot,
      note,
    });

    // 2) Send email notification
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      console.error("Missing CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL env vars");
      // still return success for user, but log config problem
    } else {
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
    }

    return new Response(JSON.stringify(booking), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in POST /api/bookings:", err);
    return new Response("Failed to submit booking.", { status: 500 });
  }
}
