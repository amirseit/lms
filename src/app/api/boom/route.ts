// src/app/api/boom/route.ts
import "../../../../sentry.server.config"; // ensure Sentry.init() runs in this server context
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  // Sanity logs (server console)
  const client = Sentry.getClient();
  console.log("Sentry client exists?", !!client);
  console.log("Sentry DSN seen by SDK:", client?.getOptions()?.dsn ?? "NONE");

  // Capture and FLUSH so event is sent before response finishes
  Sentry.captureException(new Error("Manual capture: /api/boom from server"));
  await Sentry.flush(3000); // wait up to 3s in dev

  return new Response("boom", { status: 500 });
}
