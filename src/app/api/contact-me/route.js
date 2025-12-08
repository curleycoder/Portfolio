import { NextResponse } from "next/server";
import { contactFormSchema } from "@/app/contact/schema";

// POST /api/contact-me
export async function POST(request) {
  try {
    const body = await request.json();

    // validate with zod schema you're already using on the client
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

    // For this project: logging is enough (pretend email/DB here)
    console.log("New contact message:", { name, email, message });

    return NextResponse.json(
      {
        ok: true,
        message: "Message received. Thank you!",
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

// Optional: simple GET so you can test in browser
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Contact endpoint is alive.",
  });
}
