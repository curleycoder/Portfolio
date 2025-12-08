import { auth0 } from "@/lib/auth0";
import {
  insertBookingRequest,
  fetchBookingsBetween,
} from "@/lib/db";

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

  const booking = await insertBookingRequest({
    fullName,
    email,
    date,
    timeSlot,
    note,
  });

  return new Response(JSON.stringify(booking), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
