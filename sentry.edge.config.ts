import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // use your explicit env, fall back to NODE_ENV
  environment: process.env.SENTRY_ENV ?? process.env.NODE_ENV,
  // use Vercel's commit SHA in prod, a local one in dev
  release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA,
  tracesSampleRate: 0.1,
  // debug: true, // ← remove or keep commented. Turn on only when troubleshooting.
});
