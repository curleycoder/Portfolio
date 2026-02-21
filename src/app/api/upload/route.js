// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExt(filename = "") {
  const ext = path.extname(filename).toLowerCase();
  const ok = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm"]);
  return ok.has(ext) ? ext : "";
}

export async function POST(req) {
  try {
    let form;
    try {
      form = await req.formData();
    } catch (e) {
      console.error("req.formData() failed:", e);
      return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
    }

    const file = form.get("file");

    // ✅ NEVER throw on empty body
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const ext = safeExt(file.name);
    if (!ext) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}