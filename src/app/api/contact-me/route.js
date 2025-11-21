import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// server-side schema (can be same as client)
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject: `Portfolio Contact: ${name}`,
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Email sent successfully",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}

const onSubmit = async (data) => {
  try {
    const res = await fetch("/api/contact-me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.ok) {
      alert(result.message || "Failed to send message");
      console.error("Contact error:", result);
      return;
    }

    alert("Message sent!");
    console.log("Contact success:", result);

    form.reset();
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error. Please try again.");
  }
};

