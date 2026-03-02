import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // important on Vercel

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${Date.now()}_${crypto.randomUUID()}_${safeName}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(key, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(key);

    return NextResponse.json({ url: data.publicUrl, path: key });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}