import { NextResponse } from "next/server";

export async function GET() {
  console.log("SENTRY_DSN loaded?", !!process.env.SENTRY_DSN);
  return NextResponse.json({ ok: true, ts: Date.now() });
}
