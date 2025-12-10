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

    if (!toEmail || !fromEmail || !process.env.RESEND_API_KEY) {
      console.error("CONTACT: missing email env vars.", {
        HAS_RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        HAS_CONTACT_TO_EMAIL: !!toEmail,
        HAS_CONTACT_FROM_EMAIL: !!fromEmail,
      });

      return NextResponse.json(
        {
          ok: false,
          message: "Server email configuration error.",
        },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
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

    if (error) {
      console.error("CONTACT: Resend email error:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to send email." },
        { status: 500 }
      );
    }

    console.log("CONTACT: email sent via Resend:", data);

    return NextResponse.json(
      {
        ok: true,
        message: "Message sent successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/contact-me:", err);

    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong on the server.",
      },
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
