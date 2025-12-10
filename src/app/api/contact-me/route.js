import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/app/contact/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid form data.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      console.error("Missing email env vars.");
      return NextResponse.json(
        { ok: false, message: "Email config error" },
        { status: 500 }
      );
    }

    // ⭐ THIS IS WHAT ACTUALLY SENDS THE EMAIL
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New contact message from ${name}`,
      reply_to: email,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json(
      { ok: true, message: "Message sent successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in /api/contact-me:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Contact endpoint is alive.",
  });
}
