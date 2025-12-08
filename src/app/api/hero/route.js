import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { auth0 } from "@/lib/auth0";
import { getHero, upsertHero, defaultHeroContent } from "@/lib/db";

const heroSchema = z.object({
  avatar: z.string().trim().min(1),
  fullName: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().min(2).max(120),
  longDescription: z.string().trim().min(10).max(5000),
});

export async function GET() {
  const hero = (await getHero()) ?? defaultHeroContent;
  return NextResponse.json({ data: hero });
}

export async function PUT(request) {
  try {
    await auth0.requireSession();

    const formData = await request.formData();

    const payload = heroSchema.parse({
      avatar:
        (formData.get("avatar") || defaultHeroContent.avatar).toString(),
      fullName: (formData.get("fullName") || "").toString(),
      shortDescription: (formData.get("shortDescription") || "").toString(),
      longDescription: (formData.get("longDescription") || "").toString(),
    });

    const hero = await upsertHero(payload);

    return NextResponse.json(
      { message: "Hero updated", data: hero },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/hero failed:", err);

    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", issues: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
