import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const sql = neon(process.env.NEON_DB_URL);
sql.fetchOptions = { cache: "no-store" };

export async function GET() {
  try {
    const [row] = await sql`SELECT now() AS now, version() AS version;`;
    return NextResponse.json({ ok: true, ...row });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
